export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

let isRefreshing = false;
let refreshQueue: ((token: string | null) => void)[] = [];

export async function customFetch(endpoint: string, options: RequestInit & { _retryCount?: number } = {}) {
  let token = null;
  if (typeof window !== 'undefined') {
    const storedToken = localStorage.getItem('access_token');
    // Ensure token is a non-empty string and not a placeholder
    if (storedToken && storedToken !== 'undefined' && storedToken !== 'null') {
      token = storedToken;
    }
  }

  // Khởi tạo headers một cách an toàn bằng Headers object
  const headers = new Headers(options.headers);

  // Set Content-Type mặc định nếu không phải FormData
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Thêm Authorization header nếu có token
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    // Xử lý lỗi 401 (Hết hạn hoặc thiếu Access Token)
    if (response.status === 401 && !options._retryCount && typeof window !== 'undefined') {
      if (isRefreshing) {
        // Nếu đang trong quá trình refresh, đưa yêu cầu vào hàng đợi
        return new Promise((resolve, reject) => {
          refreshQueue.push((newToken) => {
            if (newToken) {
              // Gọi lại chính hàm customFetch để đảm bảo đi qua đầy đủ logic xử lý lỗi/định dạng
              customFetch(endpoint, { ...options, _retryCount: 1 })
                .then(resolve)
                .catch(reject);
            } else {
              // Nếu refresh thất bại, trả về lỗi 401 gốc
              response.json().then(data => {
                reject(new Error(data?.message || 'Unauthorized'));
              }).catch(() => reject(new Error('Unauthorized')));
            }
          });
        });
      }

      isRefreshing = true;
      try {
        const refreshRes = await fetch(`${API_URL}/auth/refresh-token`, {
          method: 'POST',
          credentials: 'include',
        });
        const refreshData = await refreshRes.json();

        const newToken = refreshData?.access_token || refreshData?.result?.access_token;

        if (refreshRes.ok && newToken) {
          localStorage.setItem('access_token', newToken);
          
          isRefreshing = false;
          const currentToken = newToken;
          refreshQueue.forEach((callback) => callback(currentToken));
          refreshQueue = [];

          // Gọi lại chính hàm customFetch cho request hiện tại
          return customFetch(endpoint, { ...options, _retryCount: 1 });
        } else {
          isRefreshing = false;
          refreshQueue.forEach((callback) => callback(null));
          refreshQueue = [];
          
          // Clear token nếu refresh thất bại hoàn toàn
          localStorage.removeItem('access_token');
        }
      } catch (error) {
        isRefreshing = false;
        refreshQueue.forEach((callback) => callback(null));
        refreshQueue = [];
      }
    }

    // Parse JSON kết quả
    const data = await response.json().catch(() => null);
    
    if (!response.ok) {
      const errorMsg = data?.message || `Lỗi HTTP: ${response.status}`;
      
      // Bỏ qua toast cho các lỗi liên quan đến xác thực (Unauthorized) để tránh spam
      const isAuthError = response.status === 401;

      if (typeof window !== 'undefined' && !isAuthError) {
        import('sonner').then(({ toast }) => {
          toast.error(errorMsg);
        });
      }
      throw new Error(errorMsg);
    }

    return data;
  } catch (error: any) {
    // Xử lý lỗi kết nối mạng hoặc lỗi ném ra từ khối if(!response.ok)
    throw error;
  }
}
