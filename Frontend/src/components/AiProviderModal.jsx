import useAiProvider from '../hooks/useAiProvider.js';
import { ThemeContext, themes } from './ThemeContext';
import { useState, useContext } from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  background-color: ${props => props.theme.modalBackground};
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1000;
  display: flex;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
`;

const ModalContent = styled.div`
  background-color: ${props => props.theme.modalContentBackground};
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  color: ${props => props.theme.modalText};
  border-radius: 8px;
  position: relative;
  max-width: 600px;
  padding: 20px;
  width: 80%;
`;

const CloseButton = styled.button`
color: ${props => props.theme.modalText};
  position: absolute;
  font-size: 1.5rem;
  background: none;
  cursor: pointer;
  border: none;
  right: 10px;
  top: 10px;
`;

const Button = styled.button`
  background-color: ${props => props.theme.modalButtonBackground};
  color: ${props => props.theme.modalButtonText};
  border-radius: 4px;
  margin-right: 10px;
  padding: 10px 15px;
  cursor: pointer;
  border: none;
`;

const ProviderList = styled.div`
  display: ${props => (props.show ? 'block' : 'none')};
  border-top: 1px solid #eee;
  padding-top: 10px;
  margin-top: 20px;
`;

const AddProviderSection = styled.div`
  border: 1px solid ${props => props.theme.borderColor};
  margin-bottom: 10px;
  border-radius: 4px;
  padding: 10px;
`;

const Input = styled.input`
  background-color: ${props => props.theme.inputBackground};
  color: ${props => props.theme.inputText};
  border: 1px solid #ccc;
  margin-bottom: 10px;
  border-radius: 4px;
  padding: 8px;
  width: 100%;
`;

const AiProviderModal = ({ isOpen, onClose }) => {
  const [providerData, setProviderData] = useState({
    apiKey: '',
    baseUrl: '',
    model: '',
    displayName: '',
  });
  const [showAddProviderForm, setShowAddProviderForm] = useState(false);

  const { theme } = useContext(ThemeContext);
  const {
    addAiProvider,
    aiProviders,
    isLoadingProviders,
    isErrorProviders,
    providersError,
    isAddingProvider,
    isProviderAdded,
    isAddProviderError,
    addProviderError,
  } = useAiProvider();

  const handleInputChange = (e) => {
    setProviderData({ ...providerData, [e.target.name]: e.target.value });
  };

  const handleAddProvider = async () => {
    await addAiProvider(providerData);
    setProviderData({ apiKey: '', baseUrl: '', model: '', displayName: '' });
    setShowAddProviderForm(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <ModalOverlay theme={themes[theme]}>
      <ModalContent theme={themes[theme]}>
        <CloseButton onClick={onClose} theme={themes[theme]}>
          &times;
        </CloseButton>
        <h2>Manage AI Providers</h2>

        <Button onClick={() => setShowAddProviderForm(!showAddProviderForm)} theme={themes[theme]}>
          {showAddProviderForm ? 'Cancel Adding Provider' : 'Add New Provider'}
        </Button>

        {showAddProviderForm && (
          <AddProviderSection theme={themes[theme]}>
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
            {(isAddProviderError && addProviderError) && (
              <p style={{ color: 'red' }}>Error adding provider: {addProviderError.message}</p>
            )}
            {isProviderAdded && <p style={{ color: 'green' }}>Provider added successfully!</p>}
          </AddProviderSection>
        )}

        <ProviderList show={!showAddProviderForm}>
          <h3>
            Existing Providers ({isLoadingProviders ? 'Loading...' : ''})
          </h3>
          {isErrorProviders && (
            <p style={{ color: 'red' }}>Error loading providers: {providersError.message}</p>
          )}
          {aiProviders && aiProviders.length === 0 && <p>No providers configured.</p>}
          {aiProviders &&
            aiProviders.map((provider) => (
              <div key={provider.id}>{provider.displayName}</div>
            ))}
        </ProviderList>
      </ModalContent>
    </ModalOverlay>
  );
};

export default AiProviderModal;
