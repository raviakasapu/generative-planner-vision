import React from 'react';
import { Card } from "@/components/ui/card";

const Spreadsheet = () => {
  return (
    <Card className="w-full h-[600px] overflow-auto">
      <div className="p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {Array.from({ length: 10 }, (_, i) => (
                <th key={i} className="border p-2 bg-muted font-medium text-left">
                  Column {String.fromCharCode(65 + i)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 20 }, (_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: 10 }, (_, colIndex) => (
                  <td key={colIndex} className="border p-2">
                    <input
                      type="text"
                      className="w-full bg-transparent focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder=""
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default Spreadsheet;