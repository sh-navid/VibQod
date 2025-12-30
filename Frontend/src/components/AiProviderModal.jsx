import React, { useState } from 'react';
import styled from 'styled-components';
import  useAiProvider  from '../hooks/useAiProvider.js';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 600px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
`;

const ProviderList = styled.div`
  margin-top: 20px;
  border-top: 1px solid #eee;
  padding-top: 10px;
`;

const AiProviderModal = ({ isOpen, onClose }) => {
  const [providerData, setProviderData] = useState({
    apiKey: '',
    baseUrl: '',
    model: '',
    displayName: '',
  });

  const { addAiProvider, aiProviders, isLoadingProviders, isErrorProviders, providersError, refetchProviders, isAddingProvider, isProviderAdded, isAddProviderError, addProviderError  } = useAiProvider();

  const handleInputChange = (e) => {
    setProviderData({ ...providerData, [e.target.name]: e.target.value });
  };

  const handleAddProvider = async () => {
    await addAiProvider(providerData);
    setProviderData({ apiKey: '', baseUrl: '', model: '', displayName: '' });  // Clear the form
  };


  if (!isOpen) {
    return null;
  }

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <h2>Manage AI Providers</h2>

        <div>
          <h3>Add New Provider</h3>
          <Input
            type="text"
            name="displayName"
            placeholder="Display Name"
            value={providerData.displayName}
            onChange={handleInputChange}
          />
          <Input
            type="text"
            name="apiKey"
            placeholder="API Key"
            value={providerData.apiKey}
            onChange={handleInputChange}
          />
          <Input
            type="text"
            name="baseUrl"
            placeholder="Base URL"
            value={providerData.baseUrl}
            onChange={handleInputChange}
          />
          <Input
            type="text"
            name="model"
            placeholder="Model"
            value={providerData.model}
            onChange={handleInputChange}
          />
          <Button onClick={handleAddProvider} disabled={isAddingProvider}>
          {isAddingProvider ? 'Adding...' : 'Add Provider'}
          </Button>
          {(isAddProviderError && addProviderError) && <p style={{ color: 'red' }}>Error adding provider: {addProviderError.message}</p>}
           {isProviderAdded && <p style={{ color: 'green' }}>Provider added successfully!</p>}
        </div>

        <ProviderList>
          <h3>Existing Providers ({isLoadingProviders ? 'Loading...' : ''})</h3>
          {isErrorProviders && <p style={{ color: 'red' }}>Error loading providers: {providersError.message}</p>}
          {aiProviders && aiProviders.length === 0 && <p>No providers configured.</p>}
          {aiProviders && aiProviders.map((provider) => (
            <div key={provider.id}>
              {provider.displayName}
            </div>
          ))}
        </ProviderList>
      </ModalContent>
    </ModalOverlay>
  );
};

export default AiProviderModal;
