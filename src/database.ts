// Using backend API for shared database storage
// All users will see the same data

const API_URL = '/api';

interface Registration {
  id: string;
  studentId: string;
  studentName: string;
  phoneNumber: string;
  registeredAt: string;
}

// Get all registrations from the backend
export const getAllRegistrations = async (): Promise<{ success: boolean; data?: Registration[]; error?: string }> => {
  try {
    const response = await fetch(`${API_URL}/registrations`);
    const result = await response.json();
    
    if (result.success) {
      return { success: true, data: result.data };
    } else {
      return { success: false, error: result.message };
    }
  } catch (error: any) {
    console.error('Error fetching registrations:', error);
    return { success: false, error: error.message };
  }
};

// Add a new registration to the backend
export const addRegistration = async (data: {
  studentId: string;
  studentName: string;
  phoneNumber: string;
}): Promise<{ success: boolean; id?: string; error?: string }> => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    
    if (result.success) {
      return { success: true, id: result.data.id };
    } else {
      return { success: false, error: result.message };
    }
  } catch (error: any) {
    console.error('Error adding registration:', error);
    return { success: false, error: error.message };
  }
};

// Delete a registration from the backend
export const deleteRegistration = async (id: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(`${API_URL}/registrations/${id}`, {
      method: 'DELETE',
    });
    
    const result = await response.json();
    
    if (result.success) {
      return { success: true };
    } else {
      return { success: false, error: result.message };
    }
  } catch (error: any) {
    console.error('Error deleting registration:', error);
    return { success: false, error: error.message };
  }
};
