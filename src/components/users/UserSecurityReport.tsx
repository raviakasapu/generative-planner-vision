import React from 'react';
import { Card } from "@/components/ui/card";
import { useAuditLogs } from '@/hooks/useAuditLogs';

interface UserSecurityReportProps {
  userId: string;
}

export const UserSecurityReport: React.FC<UserSecurityReportProps> = ({ userId }) => {
  const { versionAudits, roleAudits, isLoading } = useAuditLogs(userId);

  if (isLoading) {
    return <div>Loading security report...</div>;
  }

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Security Report</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Version Status Changes</h4>
          <ul className="space-y-2">
            {versionAudits?.map((audit) => (
              <li key={audit.id} className="text-sm">
                Changed version status from {audit.previous_status} to {audit.new_status}
                <span className="text-gray-500 ml-2">
                  {new Date(audit.created_at).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-2">Role Changes</h4>
          <ul className="space-y-2">
            {roleAudits?.map((audit) => (
              <li key={audit.id} className="text-sm">
                Role changed from {audit.previous_role} to {audit.new_role}
                <span className="text-gray-500 ml-2">
                  {new Date(audit.created_at).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
};