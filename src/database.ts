// Using JSONStorage.app - Free cloud JSON database (no signup required)
// This provides a shared database that all users can access

const STORAGE_URL = 'https://jsonstorage.app/api/v1/stores';
const STORE_ID = 'enjaz-registration-kuwait'; // Public store ID

interface Registration {
  id: string;
  studentId: string;
  studentName: string;
  phoneNumber: string;
  registeredAt: string;
}

// Generate a unique ID
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

// Get all registrations from the cloud
export const getAllRegistrations = async (): Promise<{ success: boolean; data?: Registration[]; error?: string }> => {
  try {
    const response = await fetch(`${STORAGE_URL}/${STORE_ID}`);
    
    if (response.status === 404) {
      // Store doesn't exist yet, return empty array
      return { success: true, data: [] };
    }
    
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    
    const result = await response.json();
    return { success: true, data: result.data || [] };
  } catch (error: any) {
    console.error('Error fetching registrations:', error);
    // Fallback to localStorage if cloud fails
    const localData = JSON.parse(localStorage.getItem('enjaz_registrations') || '[]');
    return { success: true, data: localData };
  }
};

// Add a new registration to the cloud
export const addRegistration = async (data: {
  studentId: string;
  studentName: string;
  phoneNumber: string;
}): Promise<{ success: boolean; id?: string; error?: string }> => {
  try {
    // First, get existing registrations
    const existingResult = await getAllRegistrations();
    
    if (!existingResult.success) {
      throw new Error('Failed to fetch existing data');
    }
    
    const existing = existingResult.data || [];
    
    // Check for duplicate student ID
    if (existing.find((r: Registration) => r.studentId === data.studentId)) {
      return { success: false, error: 'الرقم الأكاديمي مسجل مسبقاً' };
    }
    
    // Create new registration
    const newRegistration: Registration = {
      id: generateId(),
      ...data,
      registeredAt: new Date().toISOString()
    };
    
    // Add to list
    existing.push(newRegistration);
    
    // Save to cloud
    const response = await fetch(`${STORAGE_URL}/${STORE_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: existing }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save data');
    }
    
    // Also save to localStorage as backup
    localStorage.setItem('enjaz_registrations', JSON.stringify(existing));
    
    return { success: true, id: newRegistration.id };
  } catch (error: any) {
    console.error('Error adding registration:', error);
    
    // Fallback: save to localStorage only
    const existing = JSON.parse(localStorage.getItem('enjaz_registrations') || '[]');
    
    if (existing.find((r: Registration) => r.studentId === data.studentId)) {
      return { success: false, error: 'الرقم الأكاديمي مسجل مسبقاً' };
    }
    
    const newRegistration: Registration = {
      id: generateId(),
      ...data,
      registeredAt: new Date().toISOString()
    };
    
    existing.push(newRegistration);
    localStorage.setItem('enjaz_registrations', JSON.stringify(existing));
    
    return { success: true, id: newRegistration.id };
  }
};

// Delete a registration from the cloud
export const deleteRegistration = async (id: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // Get existing registrations
    const existingResult = await getAllRegistrations();
    
    if (!existingResult.success) {
      throw new Error('Failed to fetch existing data');
    }
    
    const existing = existingResult.data || [];
    const updated = existing.filter((r: Registration) => r.id !== id);
    
    // Save to cloud
    const response = await fetch(`${STORAGE_URL}/${STORE_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: updated }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete data');
    }
    
    // Update localStorage
    localStorage.setItem('enjaz_registrations', JSON.stringify(updated));
    
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting registration:', error);
    
    // Fallback: delete from localStorage only
    const existing = JSON.parse(localStorage.getItem('enjaz_registrations') || '[]');
    const updated = existing.filter((r: Registration) => r.id !== id);
    localStorage.setItem('enjaz_registrations', JSON.stringify(updated));
    
    return { success: true };
  }
};
