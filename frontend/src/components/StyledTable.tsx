import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface Column<T> {
  key: keyof T & string;
  label: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface StyledTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (id: number) => void;
  emptyIcon?: LucideIcon;
  emptyMessage?: string;
  emptyDescription?: string;
  gradientColors?: string;
  accentColor?: string;
}

export function StyledTable<T extends { id: number }>({
  data,
  columns,
  onEdit,
  onDelete,
  emptyIcon: EmptyIcon,
  emptyMessage = 'Aucune donnée trouvée',
  emptyDescription = 'Commencez par ajouter un nouvel élément',
  gradientColors = 'from-blue-600 via-blue-700 to-blue-800',
  accentColor = 'blue'
}: StyledTableProps<T>) {
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`bg-gradient-to-r ${gradientColors}`}>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-5 text-left text-sm font-bold text-white uppercase tracking-wider ${column.className || ''}`}
                >
                  {column.label}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-6 py-5 text-center text-sm font-bold text-white uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((item, index) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`hover:bg-gradient-to-r hover:from-${accentColor}-50 hover:to-transparent transition-all duration-200 group`}
              >
                {columns.map((column) => (
                  <td key={column.key} className={`px-6 py-5 ${column.className || ''}`}>
                    {column.render ? column.render(item) : String(item[column.key])}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-6 py-5">
                    <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {onEdit && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onEdit(item)}
                          className={`p-2.5 bg-${accentColor}-100 text-${accentColor}-600 hover:bg-${accentColor}-600 hover:text-white rounded-xl transition-all shadow-sm hover:shadow-md`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </motion.button>
                      )}
                      {onDelete && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onDelete(item.id)}
                          className="p-2.5 bg-red-100 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm hover:shadow-md"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </motion.button>
                      )}
                    </div>
                  </td>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <div className="text-center py-16">
          {EmptyIcon && (
            <div className={`inline-block p-6 bg-${accentColor}-50 rounded-full mb-4`}>
              <EmptyIcon size={48} className={`text-${accentColor}-300`} />
            </div>
          )}
          <p className="text-gray-500 text-lg font-medium">{emptyMessage}</p>
          <p className="text-gray-400 text-sm mt-1">{emptyDescription}</p>
        </div>
      )}
    </motion.div>
  );
}
