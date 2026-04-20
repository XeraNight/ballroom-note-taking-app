const API_BASE = 'http://localhost:4000';

const getHeaders = () => ({
  'Content-Type': 'application/json'
});

export const lineupService = {
  // --- Lineups (Routines) ---
  
  async listLineups() {
    try {
      const response = await fetch(`${API_BASE}/lineup/list`, {
        headers: getHeaders()
      });
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: [], error };
    }
  },

  async getLineupDetail(id) {
    try {
      const response = await fetch(`${API_BASE}/lineup/get?id=${id}`, {
        headers: getHeaders()
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch lineup');
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async createLineup(name, danceType, danceName) {
    try {
      const response = await fetch(`${API_BASE}/lineup/create`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name, dance_type: danceType, dance_name: danceName })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create lineup');
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async deleteLineup(id) {
    try {
      const response = await fetch(`${API_BASE}/lineup/delete`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ id })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to delete lineup');
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error };
    }
  },

  // --- Figures ---

  async addFigure(lineupId, figureName, x, y) {
    try {
      const response = await fetch(`${API_BASE}/figure/add`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ lineup_id: lineupId, figure_name: figureName, x, y })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to add figure');
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async updateFigure(lineupId, figureId, updates) {
    try {
      const response = await fetch(`${API_BASE}/figure/update`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ lineup_id: lineupId, id: figureId, ...updates })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update figure');
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async reorderFigures(lineupId, figures) {
    try {
      await fetch(`${API_BASE}/figure/reorder`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ lineup_id: lineupId, figures: figures })
      });
      return { error: null };
    } catch (error) {
      return { error };
    }
  }
};
