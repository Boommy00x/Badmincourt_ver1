export const apiClient = {
    get: async (endpoint: string) => {
      const response = await fetch(`/api${endpoint}`);
      if (!response.ok) throw new Error('API Error');
      return response.json();
    },
    
    post: async (endpoint: string, data: any) => {
      const response = await fetch(`/api${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('API Error');
      return response.json();
    }
  };