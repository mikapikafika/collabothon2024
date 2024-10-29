import { useCallback, useState } from "react";
import { Header } from "./components/Header/Header";
import { RecommendedProducts } from "./widgets/RecommendedProducts/RecommendedProducts";
import { Chatbot } from "./widgets/Chatbot/Chatbot";
import StockWidget from "./widgets/StockWidget/StockWidget";
import { Loading } from "./components/Loading/Loading";
import { useFetchProducts } from "./hooks/useFetchProducts";
import { Box, Grow } from "@mui/material";
import { FloatingActionButton } from "./components/FloatingActionButton/FloatingActionButton";
import TextsmsIcon from "@mui/icons-material/Textsms";
import HistoryWidget from "./widgets/HistoryWidget/HistoryWidget";
import AccountWidget from "./widgets/AccountWidget";
import { IAccount, useFetchAccounts } from "../src/hooks/useFetchAccounts";
import { TransitionGroup } from "react-transition-group";
import { Footer } from "./components/Footer/Footer";
import Draggable from "react-draggable";
import "./App.css";
import { mockData1 } from "./widgets/RecommendedProducts/recommendedProductsData";
import { mockUserAccounts } from "./mockUserAccounts";

const App = () => {
    const [userId, setUserId] = useState(1);
    const [isChatbotVisible, setIsChatbotVisible] = useState(false);
    const handleChangeAccount = useCallback((accountId: number) => setUserId(accountId), []);
    //   const { data, isLoading, isFetched } = useFetchProducts(true, userId);
    // const { data: userAccounts } = useFetchAccounts();

    const toggleChatbot = () => {
        setIsChatbotVisible((prev) => !prev);
    };

    // if (isLoading || !isFetched) {
    // 	return <Loading />;
    // }

    return (
        <div className="container">
            <Header onChangeAccount={handleChangeAccount} data={mockUserAccounts} />

            <Draggable>
                <div>
                    <AccountWidget
                        userAccount={
                            mockUserAccounts ? mockUserAccounts.find((element) => element.id === userId) : undefined
                        }
                    />
                </div>
            </Draggable>
            <Draggable>
                <div>
                    <HistoryWidget userId={userId} />
                </div>
            </Draggable>
            <Draggable>
                <div>
                    <StockWidget userId={userId} />
                </div>
            </Draggable>
            <Draggable>
                <div>
                    <Box position="relative" width="30rem">
                        <RecommendedProducts data={mockData1} />
                        <FloatingActionButton onClick={toggleChatbot}>
                            <TextsmsIcon />
                        </FloatingActionButton>
                    </Box>
                    <TransitionGroup>
                        {isChatbotVisible && (
                            <Grow in={isChatbotVisible} timeout={300}>
                                <div
                                    style={{
                                        position: "fixed",
                                        bottom: "20px",
                                        right: "20px",
                                        zIndex: 100,
                                    }}
                                >
                                    <Chatbot data={mockData1} isChatbotVisible={isChatbotVisible} />
                                </div>
                            </Grow>
                        )}
                    </TransitionGroup>
                </div>
            </Draggable>
            <Footer />
        </div>
    );
};

export default App;
