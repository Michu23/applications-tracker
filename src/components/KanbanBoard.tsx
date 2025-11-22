'use client';

import { useState } from 'react';
import { Application, KanbanStatus, getKanbanColumnForStatus } from '@/types/application';
import { cn, formatDate, getDeadlineColor, getDaysRemaining } from '@/lib/utils';
import StarRating from './ui/StarRating';
import Link from 'next/link';

interface KanbanBoardProps {
  applications: Application[];
  onStatusChange: (applicationId: string, newStatus: KanbanStatus) => void;
}

const KANBAN_COLUMNS: { id: KanbanStatus; title: string; color: string }[] = [
  { id: 'Planning', title: 'Planning', color: 'bg-gray-500' },
  { id: 'In Progress', title: 'In Progress', color: 'bg-yellow-500' },
  { id: 'Applied', title: 'Applied', color: 'bg-blue-500' },
  { id: 'Decision Pending', title: 'Decision Pending', color: 'bg-orange-500' },
  { id: 'Done', title: 'Done', color: 'bg-green-500' },
];

export default function KanbanBoard({ applications, onStatusChange }: KanbanBoardProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<KanbanStatus | null>(null);

  const getApplicationsForColumn = (column: KanbanStatus): Application[] => {
    return applications.filter((app) => getKanbanColumnForStatus(app.status) === column);
  };

  const handleDragStart = (e: React.DragEvent, applicationId: string) => {
    setDraggedId(applicationId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, column: KanbanStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(column);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, column: KanbanStatus) => {
    e.preventDefault();
    if (draggedId) {
      onStatusChange(draggedId, column);
    }
    setDraggedId(null);
    setDragOverColumn(null);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {KANBAN_COLUMNS.map((column) => {
        const columnApplications = getApplicationsForColumn(column.id);
        const isDragOver = dragOverColumn === column.id;

        return (
          <div
            key={column.id}
            className={cn(
              'flex-shrink-0 w-72 bg-gray-50 rounded-xl',
              isDragOver && 'ring-2 ring-[#2979FF] ring-opacity-50'
            )}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column Header */}
            <div className="flex items-center gap-2 p-4 border-b border-gray-200">
              <div className={cn('w-3 h-3 rounded-full', column.color)} />
              <h3 className="font-semibold text-gray-900">{column.title}</h3>
              <span className="ml-auto text-sm text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                {columnApplications.length}
              </span>
            </div>

            {/* Column Cards */}
            <div className="p-3 space-y-3 min-h-[200px]">
              {columnApplications.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                  Drag applications here
                </div>
              ) : (
                columnApplications.map((app) => (
                  <KanbanCard
                    key={app.id}
                    application={app}
                    isDragging={draggedId === app.id}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface KanbanCardProps {
  application: Application;
  isDragging: boolean;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragEnd: () => void;
}

function KanbanCard({ application, isDragging, onDragStart, onDragEnd }: KanbanCardProps) {
  const daysRemaining = getDaysRemaining(application.deadline);
  const deadlineColor = getDeadlineColor(application.deadline);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, application.id)}
      onDragEnd={onDragEnd}
      className={cn(
        'bg-white rounded-lg border border-gray-200 p-3 cursor-grab active:cursor-grabbing',
        'hover:shadow-md hover:border-[#2979FF]/30 transition-all duration-200',
        isDragging && 'opacity-50 shadow-lg'
      )}
    >
      <Link href={`/application/${application.id}`} className="block">
        <h4 className="font-medium text-gray-900 text-sm truncate">{application.courseName}</h4>
        <p className="text-xs text-gray-500 truncate mt-0.5">{application.university}</p>

        <div className="flex items-center justify-between mt-3">
          <span
            className={cn(
              'text-xs font-medium',
              deadlineColor === 'red' && 'text-red-600',
              deadlineColor === 'orange' && 'text-orange-500',
              deadlineColor === 'default' && 'text-gray-500'
            )}
          >
            {formatDate(application.deadline)}
          </span>
          <StarRating value={application.priority} readonly size="sm" />
        </div>

        <div
          className={cn(
            'text-xs mt-1',
            deadlineColor === 'red' && 'text-red-500',
            deadlineColor === 'orange' && 'text-orange-400',
            deadlineColor === 'default' && 'text-gray-400'
          )}
        >
          {daysRemaining < 0
            ? `${Math.abs(daysRemaining)} days ago`
            : daysRemaining === 0
            ? 'Today!'
            : `${daysRemaining} days left`}
        </div>
      </Link>
    </div>
  );
}
