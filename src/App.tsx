import { useState } from 'react';
import { Layout } from './components/Layout';
import { PlantIdentifier } from './components/PlantIdentifier';
import { GardeningChat } from './components/GardeningChat';

export default function App() {
  const [activeTab, setActiveTab] = useState<'identify' | 'chat'>('identify');

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'identify' ? (
        <PlantIdentifier />
      ) : (
        <GardeningChat />
      )}
    </Layout>
  );
}
