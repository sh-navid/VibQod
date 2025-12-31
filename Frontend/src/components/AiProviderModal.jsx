import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import  useAiProvider  from '../hooks/useAiProvider.js';
import { ThemeContext, themes } from './ThemeContext';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${props => props.theme.modalBackground};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: ${props => props.theme.modalContentBackground};
  color: ${props => props.theme.modalText};
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
  color: ${props => props.theme.modalText};
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: ${props => props.theme.inputText};
  background-color: ${props => props.theme.inputBackground};
`;

const Button = styled.button`
  background-color: ${props => props.theme.modalButtonBackground};
  color: ${props => props.theme.modalButtonText};
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

  const { theme } = useContext(ThemeContext);

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
    <ModalOverlay theme={themes[theme]}>
      <ModalContent theme={themes[theme]}>
        <CloseButton onClick={onClose} theme={themes[theme]}>&times;</CloseButton>
        <h2>Manage AI Providers</h2>

        <div>
          <h3>Add New Provider</h3>
          <Input
            type="text"
            name="displayName"
            placeholder="Display Name"
            value={providerData.displayName}
            onChange={handleInputChange}
            theme={themes[theme]}
          />
          <Input
            type="text"
            name="apiKey"
            placeholder="API Key"
            value={providerData.apiKey}
            onChange={handleInputChange}
            theme={themes[theme]}
          />
          <Input
            type="text"
            name="baseUrl"
            placeholder="Base URL"
            value={providerData.baseUrl}
            onChange={handleInputChange}
            theme={themes[theme]}
          />
          <Input
            type="text"
            name="model"
            placeholder="Model"
            value={providerData.model}
            onChange={handleInputChange}
            theme={themes[theme]}
          />
          <Button onClick={handleAddProvider} disabled={isAddingProvider} theme={themes[theme]}>
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
