import { useState, useEffect } from 'react';
import { taskAPI, type TaskHistoryEntry } from '../services/api';
import './TaskHistory.css';

type HistoryItem = TaskHistoryEntry;
type TaskSnapshot = TaskHistoryEntry['old_data'];

export function TaskHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [limit, setLimit] = useState(50);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const data = await taskAPI.getTaskHistory(selectedTaskId || undefined, limit);

        if (data.success) {
          setHistory(data.data ?? []);
        } else {
          console.error('Failed to fetch history:', data.message);
          setHistory([]);
        }
      } catch (error) {
        console.error('Error fetching history:', error);
        // Fallback to empty array on error
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [selectedTaskId, limit]);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'created': return '✨';
      case 'updated': return '📝';
      case 'completed': return '✅';
      case 'uncompleted': return '❌';
      case 'deleted': return '🗑️';
      case 'restored': return '🔄';
      case 'hard_deleted': return '💥';
      default: return '📄';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'created': return '#4CAF50';
      case 'updated': return '#2196F3';
      case 'completed': return '#8BC34A';
      case 'uncompleted': return '#FF9800';
      case 'deleted': return '#F44336';
      case 'restored': return '#9C27B0';
      case 'hard_deleted': return '#8B0000';
      default: return '#757575';
    }
  };

  const renderChangedFields = (changedFields: string[]) => {
    if (!changedFields || changedFields.length === 0) return null;
    
    return (
      <div className="changed-fields">
        <strong>Changed fields:</strong> {changedFields.join(', ')}
      </div>
    );
  };

  const renderDataComparison = (oldData: TaskSnapshot, newData: TaskSnapshot, action: string) => {
    if (action === 'created') {
      return (
        <div className="data-comparison">
          <div className="new-data">
            <strong>Created:</strong> {newData?.title || 'Unknown Task'}
            {newData?.description && <div>Description: {newData.description}</div>}
            {newData?.priority && <div>Priority: {newData.priority}</div>}
          </div>
        </div>
      );
    }

    if (action === 'deleted' && oldData) {
      return (
        <div className="data-comparison">
          <div className="old-data">
            <strong>Deleted:</strong> {oldData.title}
          </div>
        </div>
      );
    }

    if (action === 'updated' && oldData && newData) {
      return (
        <div className="data-comparison">
          <div className="old-data">
            <strong>Before:</strong> {oldData.title}
          </div>
          <div className="new-data">
            <strong>After:</strong> {newData.title}
          </div>
        </div>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <div className="task-history">
        <div className="loading">Loading task history...</div>
      </div>
    );
  }

  return (
    <div className="task-history">
      <div className="history-header">
        <h2>📚 Task History</h2>
        <div className="history-controls">
          <input
            type="text"
            placeholder="Filter by Task ID (optional)"
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            className="task-id-filter"
          />
          <select 
            value={limit} 
            onChange={(e) => setLimit(Number(e.target.value))}
            className="limit-selector"
          >
            <option value={25}>25 entries</option>
            <option value={50}>50 entries</option>
            <option value={100}>100 entries</option>
            <option value={200}>200 entries</option>
          </select>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="no-history">
          <p>No task history found.</p>
        </div>
      ) : (
        <div className="history-timeline">
          {history.map((item) => (
            <div key={item.history_id} className="history-item">
              <div 
                className="action-indicator"
                style={{ backgroundColor: getActionColor(item.action) }}
              >
                {getActionIcon(item.action)}
              </div>
              
              <div className="history-content">
                <div className="history-meta">
                  <span className="task-title">{item.task_title}</span>
                  <span className="action-type">{item.action}</span>
                  <span className="timestamp">{formatTimestamp(item.action_timestamp)}</span>
                </div>
                
                {renderChangedFields(item.changed_fields)}
                {renderDataComparison(item.old_data, item.new_data, item.action)}
                
                <div className="task-id-small">ID: {item.task_id}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}