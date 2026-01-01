/**
 * Main App Component
 * Smart component that connects to Zustand store
 * and passes data to dumb components
 */

import { MainLayout } from '@/components/layout';
import { BingoBoard, SettingsPanel } from '@/components/bingo';
import { useBingoStore } from '@/store/useBingoStore';

const App = () => {
  // Select state from store
  const cells = useBingoStore((state) => state.cells);
  const title = useBingoStore((state) => state.title);
  const backgroundImageUrl = useBingoStore((state) => state.backgroundImageUrl);
  const selectedTemplate = useBingoStore((state) => state.selectedTemplate);

  // Select actions from store
  const setTemplate = useBingoStore((state) => state.setTemplate);
  const setBackgroundImage = useBingoStore((state) => state.setBackgroundImage);

  const handleCellTap = (id: string) => {
    // For now, just log - cell editing will be implemented in future phase
    console.log('Cell tapped:', id);
  };

  return (
    <MainLayout>
      <div className="py-6">
        {/* Title */}
        <h1 className="text-2xl font-bold text-center mb-4 px-4">
          {title}
        </h1>

        {/* Bingo Board */}
        <BingoBoard
          cells={cells}
          backgroundImageUrl={backgroundImageUrl}
          selectedTemplate={selectedTemplate}
          onCellTap={handleCellTap}
        />

        {/* Settings Panel */}
        <div className="mt-6">
          <SettingsPanel
            selectedTemplate={selectedTemplate}
            backgroundImageUrl={backgroundImageUrl}
            onTemplateSelect={setTemplate}
            onImageUpload={setBackgroundImage}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default App;
