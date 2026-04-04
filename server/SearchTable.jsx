import React, { useState } from 'react';

const SearchTable = ({ columns, data = [], onSearch, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // You can implement debounce here if calling API directly
    if (onSearch) onSearch(value);
  };

  const openDeleteModal = (item) => {
    setItemToDelete(item);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setItemToDelete(null);
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (itemToDelete && onDelete) {
      // Pass the _id or id depending on your data schema
      onDelete(itemToDelete._id || itemToDelete.id);
      closeDeleteModal();
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 mt-6">
      <div className="mb-4 flex justify-between items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm bằng tên hoặc email..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-80 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {/* Search Icon */}
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {col.header}
                </th>
              ))}
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-24">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data && data.length > 0 ? (
              data.map((item, index) => (
                <tr key={item._id || item.id || index} className="hover:bg-gray-50 transition-colors">
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {/* Render custom func if provided, else output the primitive data */}
                      {col.render ? col.render(item[col.accessor], item) : item[col.accessor]}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => openDeleteModal(item)}
                      className="text-gray-400 hover:text-red-500 focus:outline-none transition-colors"
                      title="Deactivate / Soft Delete"
                    >
                      {/* Trash SVG Icon */}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-8 text-center text-gray-500">
                  <p className="text-sm">Không tìm thấy dữ liệu trùng khớp</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Tailwind Modal Overlay for Delete Confirmation */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-40 cursor-pointer" onClick={closeDeleteModal}></div>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 relative z-10 transform scale-100 transition-transform">
            
            {/* Warning Icon Head */}
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>

            <h3 className="text-lg font-bold text-center text-gray-900 mb-2">
              Xác nhận thay đổi
            </h3>
            <p className="text-sm text-center text-gray-500 mb-6 px-2">
              Bạn có chắc chắn muốn thực hiện hành động vô hiệu hóa/xóa mục này không? Thao tác có thể ảnh hưởng tới dữ liệu thống kê.
            </p>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={closeDeleteModal}
                className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded hover:bg-gray-50 focus:outline-none transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2 bg-red-600 border border-transparent text-white font-medium rounded shadow hover:bg-red-700 focus:outline-none transition-colors"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchTable;
