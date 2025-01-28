import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search } from 'lucide-react';

interface Dimension {
  id: string;
  dimension_name: string;
  product_id?: string;
  region_id?: string;
  datasource_id?: string;
  product_description?: string;
  region_description?: string;
  datasource_description?: string;
  category?: string;
  country?: string;
  hierarchy_level?: string;
  datasource_type?: string;
  system_of_origin?: string;
}

const MasterData = () => {
  const [dimensions, setDimensions] = useState<Dimension[]>([]);
  const [newDimension, setNewDimension] = useState({ 
    id: "", 
    name: "", 
    type: "product",
    description: "",
    category: "",
    systemOrigin: "",
  });
  const [showData, setShowData] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingDimension, setEditingDimension] = useState<Dimension | null>(null);
  const itemsPerPage = 5;
  const { toast } = useToast();

  useEffect(() => {
    if (showData) {
      fetchDimensions();
    }
  }, [showData]);

  const fetchDimensions = async () => {
    try {
      // Fetch products
      const { data: products, error: productsError } = await supabase
        .from('masterdimension1')
        .select('*')
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;

      // Fetch regions
      const { data: regions, error: regionsError } = await supabase
        .from('masterdimension2')
        .select('*')
        .order('created_at', { ascending: false });

      if (regionsError) throw regionsError;

      // Fetch datasources
      const { data: datasources, error: datasourcesError } = await supabase
        .from('masterdatasourcedimension')
        .select('*')
        .order('created_at', { ascending: false });

      if (datasourcesError) throw datasourcesError;

      setDimensions([
        ...(products || []).map(p => ({ ...p, dimension_type: 'product' })),
        ...(regions || []).map(r => ({ ...r, dimension_type: 'region' })),
        ...(datasources || []).map(d => ({ ...d, dimension_type: 'datasource' }))
      ]);
    } catch (error) {
      console.error('Error fetching dimensions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch master data",
        variant: "destructive",
      });
    }
  };

  const handleAddDimension = async () => {
    if (!newDimension.id || !newDimension.name) {
      toast({
        title: "Validation Error",
        description: "ID and Name are required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      let table = '';
      let insertData = {};
      
      switch(newDimension.type) {
        case 'product':
          table = 'masterdimension1';
          insertData = {
            product_id: newDimension.id,
            product_description: newDimension.name,
            category: newDimension.category,
            dimension_name: 'Products'
          };
          break;
        case 'region':
          table = 'masterdimension2';
          insertData = {
            region_id: newDimension.id,
            region_description: newDimension.name,
            country: newDimension.category,
            dimension_name: 'Regions'
          };
          break;
        case 'datasource':
          table = 'masterdatasourcedimension';
          insertData = {
            datasource_id: newDimension.id,
            datasource_name: newDimension.name,
            datasource_description: newDimension.description,
            datasource_type: newDimension.category,
            system_of_origin: newDimension.systemOrigin,
            dimension_name: 'Data Source'
          };
          break;
      }
      
      const { data, error } = await supabase
        .from(table)
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      setDimensions(prev => [...prev, { ...data, dimension_type: newDimension.type }]);
      setNewDimension({ id: "", name: "", type: "product", description: "", category: "", systemOrigin: "" });
      
      toast({
        title: "Success",
        description: `${newDimension.name} has been added successfully to ${newDimension.type} master data.`,
      });
    } catch (error) {
      console.error('Error adding dimension:', error);
      toast({
        title: "Error",
        description: `Failed to add master data: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleUpdateDimension = async () => {
    if (!editingDimension) return;

    try {
      let table = '';
      let updateData = {};
      
      switch(editingDimension.dimension_type) {
        case 'product':
          table = 'masterdimension1';
          updateData = {
            product_id: editingDimension.product_id,
            product_description: editingDimension.product_description,
            category: editingDimension.category,
          };
          break;
        case 'region':
          table = 'masterdimension2';
          updateData = {
            region_id: editingDimension.region_id,
            region_description: editingDimension.region_description,
            country: editingDimension.country,
          };
          break;
        case 'datasource':
          table = 'masterdatasourcedimension';
          updateData = {
            datasource_id: editingDimension.datasource_id,
            datasource_name: editingDimension.datasource_description,
            datasource_description: editingDimension.datasource_description,
            datasource_type: editingDimension.datasource_type,
            system_of_origin: editingDimension.system_of_origin,
          };
          break;
      }

      const { error } = await supabase
        .from(table)
        .update(updateData)
        .eq('id', editingDimension.id);

      if (error) throw error;

      setDimensions(prev => 
        prev.map(dim => dim.id === editingDimension.id ? editingDimension : dim)
      );
      setEditingDimension(null);
      
      toast({
        title: "Success",
        description: "Master data updated successfully",
      });
    } catch (error) {
      console.error('Error updating dimension:', error);
      toast({
        title: "Error",
        description: `Failed to update master data: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const filteredDimensions = dimensions.filter(dim => {
    const searchString = searchTerm.toLowerCase();
    return (
      dim.product_id?.toLowerCase().includes(searchString) ||
      dim.product_description?.toLowerCase().includes(searchString) ||
      dim.region_id?.toLowerCase().includes(searchString) ||
      dim.region_description?.toLowerCase().includes(searchString) ||
      dim.datasource_id?.toLowerCase().includes(searchString) ||
      dim.datasource_description?.toLowerCase().includes(searchString)
    );
  });

  const paginatedDimensions = filteredDimensions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredDimensions.length / itemsPerPage);

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">Master Data Management</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">ID</label>
            <Input
              value={newDimension.id}
              onChange={(e) => setNewDimension(prev => ({ ...prev, id: e.target.value }))}
              placeholder="Enter ID..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input
              value={newDimension.name}
              onChange={(e) => setNewDimension(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter name..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              className="w-full border rounded-md p-2"
              value={newDimension.type}
              onChange={(e) => setNewDimension(prev => ({ ...prev, type: e.target.value }))}
            >
              <option value="product">Product</option>
              <option value="region">Region</option>
              <option value="datasource">Data Source</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Input
              value={newDimension.description}
              onChange={(e) => setNewDimension(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter description..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              {newDimension.type === 'product' ? 'Category' : 
               newDimension.type === 'region' ? 'Country' : 
               'Data Source Type'}
            </label>
            <Input
              value={newDimension.category}
              onChange={(e) => setNewDimension(prev => ({ ...prev, category: e.target.value }))}
              placeholder="Enter category/country/type..."
            />
          </div>
          {newDimension.type === 'datasource' && (
            <div>
              <label className="block text-sm font-medium mb-1">System of Origin</label>
              <Input
                value={newDimension.systemOrigin}
                onChange={(e) => setNewDimension(prev => ({ ...prev, systemOrigin: e.target.value }))}
                placeholder="Enter system of origin..."
              />
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <Button onClick={handleAddDimension}>Add Master Data</Button>
          <Button 
            variant="outline"
            onClick={() => {
              setShowData(!showData);
              if (!showData) fetchDimensions();
            }}
          >
            {showData ? 'Hide Master Data' : 'Show Master Data'}
          </Button>
        </div>

        {showData && (
          <>
            <div className="flex items-center space-x-2 mb-4">
              <Search className="w-4 h-4 text-gray-500" />
              <Input
                placeholder="Search master data..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category/Country</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedDimensions.map((dim) => (
                    <TableRow key={dim.id}>
                      <TableCell>
                        {editingDimension?.id === dim.id ? (
                          <Input
                            value={editingDimension[`${dim.dimension_type}_id`] || ''}
                            onChange={(e) => setEditingDimension(prev => ({
                              ...prev!,
                              [`${dim.dimension_type}_id`]: e.target.value
                            }))}
                          />
                        ) : (
                          dim.product_id || dim.region_id || dim.datasource_id
                        )}
                      </TableCell>
                      <TableCell>
                        {editingDimension?.id === dim.id ? (
                          <Input
                            value={editingDimension[`${dim.dimension_type}_description`] || ''}
                            onChange={(e) => setEditingDimension(prev => ({
                              ...prev!,
                              [`${dim.dimension_type}_description`]: e.target.value
                            }))}
                          />
                        ) : (
                          dim.product_description || dim.region_description || dim.datasource_description
                        )}
                      </TableCell>
                      <TableCell>{dim.dimension_type}</TableCell>
                      <TableCell>
                        {editingDimension?.id === dim.id ? (
                          <Input
                            value={editingDimension.datasource_description || ''}
                            onChange={(e) => setEditingDimension(prev => ({
                              ...prev!,
                              datasource_description: e.target.value
                            }))}
                          />
                        ) : (
                          dim.datasource_description || '-'
                        )}
                      </TableCell>
                      <TableCell>
                        {editingDimension?.id === dim.id ? (
                          <Input
                            value={editingDimension.category || editingDimension.country || editingDimension.datasource_type || ''}
                            onChange={(e) => setEditingDimension(prev => ({
                              ...prev!,
                              [dim.dimension_type === 'product' ? 'category' : 
                               dim.dimension_type === 'region' ? 'country' : 
                               'datasource_type']: e.target.value
                            }))}
                          />
                        ) : (
                          dim.category || dim.country || dim.datasource_type || '-'
                        )}
                      </TableCell>
                      <TableCell>
                        {editingDimension?.id === dim.id ? (
                          <div className="space-x-2">
                            <Button onClick={handleUpdateDimension} size="sm">Save</Button>
                            <Button onClick={() => setEditingDimension(null)} variant="outline" size="sm">Cancel</Button>
                          </div>
                        ) : (
                          <Button onClick={() => setEditingDimension(dim)} variant="outline" size="sm">Edit</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </>
        )}
      </div>
    </Card>
  );
};

export default MasterData;