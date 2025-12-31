import useAiProvider from '../hooks/useAiProvider.js';
import { ThemeContext, themes } from './ThemeContext';
import { useState, useContext } from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  background-color: rgba(0, 0, 0, 0.6); // Semi-transparent background
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
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3); // Increased shadow
  color: ${props => props.theme.modalText};
  border-radius: 12px; // Rounded corners
  position: relative;
  max-width: 700px; // Wider modal
  width: 90%; // Responsive width
  padding: 30px; // More padding
  overflow-y: auto; // Add scroll if content overflows
  max-height: 80vh; // Set a maximum height
`;

const CloseButton = styled.button`
  color: ${props => props.theme.modalText};
  position: absolute;
  font-size: 2rem; // Larger close button
  background: none;
  cursor: pointer;
  border: none;
  right: 15px;
  top: 15px;
  padding: 0; // Remove default button padding
  line-height: 1; // Adjust line-height
`;

const Button = styled.button`
  background-color: ${props => props.theme.modalButtonBackground};
  color: ${props => props.theme.modalButtonText};
  border-radius: 6px; // Rounded corners
  margin-right: 15px;
  padding: 12px 20px;
  cursor: pointer;
  border: none;
  font-size: 1rem;
  transition: background-color 0.2s ease; // Add a hover effect
  &:hover {
    background-color: ${props => props.theme.modalButtonHover}; // Define hover color in theme
  }
`;

const DeleteButton = styled(Button)`
  background-color: ${props => props.theme.deleteButtonBackground};
  color: ${props => props.theme.deleteButtonText};
  &:hover {
    background-color: ${props => props.theme.deleteButtonHover};
  }
`;

const AddButton = styled(Button)`
  &:before {
    content: '+ ';
  }
  &:after {
     content: ${props => props.showText ? '"Add New Provider" ' : ''};  
  }
`;

const ProviderList = styled.div`
  display: ${props => (props.show ? 'block' : 'none')};
  border-top: 1px solid ${props => props.theme.borderColor};
  padding-top: 20px;
  margin-top: 30px;
  overflow-y: auto; // Add a scroll if the provider list is long
  max-height: 300px; // Set a maximum height for the provider list
`;

const AddProviderSection = styled.div`
  border: 1px solid ${props => props.theme.borderColor};
  margin-bottom: 20px;
  border-radius: 8px; // Rounded corners
  padding: 20px;
`;

const Input = styled.input`
  background-color: ${props => props.theme.inputBackground};
  color: ${props => props.theme.inputText};
  border: 1px solid #ccc;
  margin-bottom: 15px;
  border-radius: 6px; // Rounded corners
  padding: 12px;
  width: 100%;
  font-size: 1rem;
`;

const ProviderItem = styled.div`
  background-color: ${props => props.theme.listItemBackground};
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 10px;
  border: 1px solid ${props => props.theme.borderColor};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AiProviderModal = ({ isOpen, onClose }) => {
  const [providerData, setProviderData] = useState({
    apiKey: '',
    baseUrl: '',
    model: '',
    displayName: '',
  });
  const [showAddProviderForm, setShowAddProviderForm] = useState(false);
  const [selectedProviderIdToDelete, setSelectedProviderIdToDelete] = useState(null);

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
    removeAiProvider,
    isRemovingProvider,
    isProviderRemoved,
    isRemoveProviderError,
    removeProviderError,
  } = useAiProvider();

  const handleInputChange = (e) => {
    setProviderData({ ...providerData, [e.target.name]: e.target.value });
  };

  const handleAddProvider = async () => {
    await addAiProvider(providerData);
    setProviderData({ apiKey: '', baseUrl: '', model: '', displayName: '' });
    setShowAddProviderForm(false);
  };

  const handleDeleteProvider = async (id) => {
    setSelectedProviderIdToDelete(id);
    await removeAiProvider(id);
    setSelectedProviderIdToDelete(null);
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

        <AddButton onClick={() => setShowAddProviderForm(!showAddProviderForm)} theme={themes[theme]} showText={!showAddProviderForm}>
          {showAddProviderForm ? 'Cancel Adding Provider' : ''}
        </AddButton>

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

        <ProviderList show={!showAddProviderForm} theme={themes[theme]}>
          <h3>
            Existing Providers ({isLoadingProviders ? 'Loading...' : ''})
          </h3>
          {isErrorProviders && (
            <p style={{ color: 'red' }}>Error loading providers: {providersError.message}</p>
          )}
          {aiProviders && aiProviders.length === 0 && <p>No providers configured.</p>}
          {aiProviders &&
            aiProviders.map((provider) => (
              <ProviderItem key={provider.id} theme={themes[theme]}>
                {provider.displayName}
                  <div>
                    <DeleteButton onClick={() => handleDeleteProvider(provider.id)} theme={themes[theme]} disabled={isRemovingProvider && selectedProviderIdToDelete === provider.id}>
                      {isRemovingProvider && selectedProviderIdToDelete === provider.id ? 'Deleting...' : 'Delete'}
                    </DeleteButton>
                  </div>
              </ProviderItem>
            ))}
            {(isRemoveProviderError && removeProviderError) && (
                <p style={{ color: 'red' }}>Error deleting provider: {removeProviderError.message}</p>
            )}
            {isProviderRemoved && <p style={{ color: 'green' }}>Provider deleted successfully!</p>}
        </ProviderList>
      </ModalContent>
    </ModalOverlay>
  );
};

export default AiProviderModal;
