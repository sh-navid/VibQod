import styled from 'styled-components';
import { useState } from 'react';
import { IconButton } from './IconButton';
import useAiProvider from '../hooks/useAiProvider';
import useAi from '../hooks/useAi';
import { useClearAiHistory } from '../services/aiService';
import AiProviderModal from './AiProviderModal';



/* ──────────────────────────  STYLES  ────────────────────────── */
const BottomBarContainer = styled.div`
  background-color: ${(props) => props.theme.headerBackground};
  padding: 10px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid ${(props) => props.theme.borderColor};
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
`;

const BottomInput = styled.input`
  background-color: ${(props) => props.theme.inputBackground};
  border: 1px solid ${(props) => props.theme.borderColor};
  color: ${(props) => props.theme.inputText};
  padding: 8px;
  width: 70%;
  height: 3rem;
  outline: none;
  border-radius: 8px;
`;

const baseHover = (color) => `
  &:hover {
    background-color: ${color};
  }
`;

const ClearButton = styled(IconButton)`
  color: #fff;
  ${baseHover('rgba(220, 53, 69, 0.2)')}
`;

const AssistantButton = styled(IconButton)`
  color: gold;
  ${baseHover('rgba(220, 209, 53, 0.2)')}
`;

const SendButton = styled(IconButton)`
  color: #fff;
  ${baseHover('rgba(25, 135, 84, 0.2)')}
`;

const ProviderButton = styled(IconButton)`
  color: #fff;
  ${baseHover('rgba(100, 100, 255, 0.2)')} // Example color, adjust as needed
`;

/* ──────────────────────────  COMPONENT  ────────────────────────── */
const BottomBar = () => {
  const [prompt, setPrompt] = useState('');
  const { sendPrompt } = useAi();
  const { mutateAsync: clearHistory, isLoading: isClearing } = useClearAiHistory();
  const [isModalOpen, setIsModalOpen] = useState(false);  // State for the modal

  const handleInputChange = (e) => setPrompt(e.target.value);

  const handleClearClick = async () => {
    await clearHistory();      // wait until mutation completes
    setPrompt('');
  };

  const handleSendClick = async () => {
    if (prompt.trim()) {
      await sendPrompt(prompt);
      setPrompt('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendClick();
      e.preventDefault();      // prevent newline
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <BottomBarContainer>
      <AssistantButton href="#" aria-label="Assistant">
        <span className="material-icons">assistant</span>
      </AssistantButton>

      <BottomInput
        type="text"
        placeholder="Prompt | /Command | @Attach"
        value={prompt}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />

      <ClearButton href="#" aria-label="Clear" onClick={handleClearClick}>
        {isClearing ? (
          <span className="material-icons">refresh</span>
        ) : (
          <span className="material-icons">close</span>
        )}
      </ClearButton>

      <ProviderButton href="#" aria-label="Manage Providers" onClick={openModal}>
        <span className="material-icons">settings</span>
      </ProviderButton>

      <SendButton href="#" aria-label="Send" onClick={handleSendClick}>
        <span className="material-icons">send</span>
      </SendButton>
      <AiProviderModal isOpen={isModalOpen} onClose={closeModal} />
      {/*  modal here */}
    </BottomBarContainer>
  );
};

export default BottomBar;
