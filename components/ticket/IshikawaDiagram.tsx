
import React, { useState } from 'react';
import { IshikawaData } from '../../types';
import { ISHIKAWA_CATEGORIES } from '../../constants';
import Card from '../ui/Card';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface IshikawaDiagramProps {
  data: IshikawaData;
  onUpdate: (newData: IshikawaData) => void;
}

const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>;

const IshikawaDiagram: React.FC<IshikawaDiagramProps> = ({ data, onUpdate }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [newCause, setNewCause] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedMsg, setShowSavedMsg] = useState(false);

  const handleAddCauseClick = (category: string) => {
    setCurrentCategory(category);
    setModalOpen(true);
  };

  const handleAddCauseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCause.trim() && currentCategory) {
      const newData = { ...data };
      newData.categories[currentCategory] = [...(newData.categories[currentCategory] || []), newCause];
      onUpdate(newData);
      setNewCause('');
      setModalOpen(false);
      setCurrentCategory(null);
    }
  };

  const removeCause = (category: string, index: number) => {
    const newData = { ...data };
    newData.categories[category] = newData.categories[category].filter((_, i) => i !== index);
    onUpdate(newData);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await onUpdate(data);
    setIsSaving(false);
    setShowSavedMsg(true);
    setTimeout(() => setShowSavedMsg(false), 3000);
  };

  const categoriesTop = ISHIKAWA_CATEGORIES.slice(0, 3);
  const categoriesBottom = ISHIKAWA_CATEGORIES.slice(3, 6);

  return (
    <Card title="Diagrama de Causa y Efecto (Ishikawa)" extra={
      <div className="flex items-center gap-4">
        {showSavedMsg && <span className="text-success text-sm font-medium animate-pulse">¡Cambios guardados!</span>}
        <Button onClick={handleSave} variant="success" size="sm" disabled={isSaving}>
          {isSaving ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>
    }>
      <div className="w-full overflow-x-auto">
        <svg viewBox="0 0 800 400" className="min-w-[800px]">
          {/* Main Spine & Head */}
          <line x1="50" y1="200" x2="690" y2="200" stroke="#333" strokeWidth="2" />
          <polygon points="690,195 700,200 690,205" fill="#333" />
          <rect x="700" y="180" width="90" height="40" fill="#002279" />
          <text x="745" y="205" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Problema</text>

          {/* Categories */}
          {categoriesTop.map((category, index) => (
            <g key={category}>
              <line x1={150 + index * 200} y1="100" x2={250 + index * 200} y2="200" stroke="#333" strokeWidth="1" />
              <text x={140 + index * 200} y="90" textAnchor="start" fontSize="12" fontWeight="bold">{category}</text>
              <foreignObject x={240 + index * 200} y="80" width="20" height="20">
                <button onClick={() => handleAddCauseClick(category)} className="p-1 bg-primary text-white rounded-full hover:bg-accent focus:outline-none"><PlusIcon /></button>
              </foreignObject>
              {/* Causes */}
              {(data.categories[category] || []).map((cause, causeIndex) => (
                <g key={causeIndex}>
                  <line x1={160 + index * 200 + causeIndex * 10} y1={120 + causeIndex * 15} x2={190 + index * 200 + causeIndex * 10} y2={120 + causeIndex * 15} stroke="gray" strokeWidth="1" />
                  <text x={195 + index * 200 + causeIndex * 10} y={124 + causeIndex * 15} fontSize="10">{cause}</text>
                  <foreignObject x={280 + index * 200 + causeIndex * 10} y={115 + causeIndex * 15} width="12" height="12">
                    <button onClick={() => removeCause(category, causeIndex)} className="text-red-500 hover:text-red-700">×</button>
                  </foreignObject>
                </g>
              ))}
            </g>
          ))}

          {categoriesBottom.map((category, index) => (
            <g key={category}>
              <line x1={150 + index * 200} y1="300" x2={250 + index * 200} y2="200" stroke="#333" strokeWidth="1" />
              <text x={140 + index * 200} y="315" textAnchor="start" fontSize="12" fontWeight="bold">{category}</text>
              <foreignObject x={240 + index * 200} y="295" width="20" height="20">
                <button onClick={() => handleAddCauseClick(category)} className="p-1 bg-primary text-white rounded-full hover:bg-accent focus:outline-none"><PlusIcon /></button>
              </foreignObject>
              {/* Causes */}
              {(data.categories[category] || []).map((cause, causeIndex) => (
                <g key={causeIndex}>
                  <line x1={160 + index * 200 + causeIndex * 10} y1={280 - causeIndex * 15} x2={190 + index * 200 + causeIndex * 10} y2={280 - causeIndex * 15} stroke="gray" strokeWidth="1" />
                  <text x={195 + index * 200 + causeIndex * 10} y={284 - causeIndex * 15} fontSize="10">{cause}</text>
                  <foreignObject x={280 + index * 200 + causeIndex * 10} y={275 - causeIndex * 15} width="12" height="12">
                    <button onClick={() => removeCause(category, causeIndex)} className="text-red-500 hover:text-red-700">×</button>
                  </foreignObject>
                </g>
              ))}
            </g>
          ))}
        </svg>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title={`Añadir Causa a "${currentCategory}"`}>
        <form onSubmit={handleAddCauseSubmit}>
          <label htmlFor="newCause" className="block text-sm font-medium text-gray-700">Nueva Causa</label>
          <input
            type="text"
            id="newCause"
            value={newCause}
            onChange={e => setNewCause(e.target.value)}
            autoFocus
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
          <div className="mt-4 flex justify-end">
            <Button type="submit">Añadir</Button>
          </div>
        </form>
      </Modal>
    </Card>
  );
};

export default IshikawaDiagram;
