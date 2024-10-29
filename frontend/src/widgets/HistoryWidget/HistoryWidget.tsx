/** @jsxImportSource @emotion/react */
import React, { useState } from "react";
import HistoryList from "../../components/HistoryList";
import { WidgetContainer } from "../../components/WidgetContainer/WidgetContainer";
import { Box, Button, Typography } from "@mui/material";
import { historyButtonsStyle, historyHeaderStyle } from "./HistoryWidget.styles";
import { data } from "./historyData";



const filterOptions = ["all", "income", "charge", "trade"];

interface HistoryWidgetProps {
	userId: number;
}


const HistoryWidget: React.FC<HistoryWidgetProps> = ({ userId }: HistoryWidgetProps) => {
	const [filter, setFilter] = useState<string>("all");

	const filteredData = data[userId - 1].filter((item) => {
		if (filter === "all") return true;
		if (filter === "income") {
			return item.transactionType === "LOAN" || (item.transactionType === "MONEY_TRANSFER" && item.amount > 0);
		}
		if (filter === "charge") {
			return item.transactionType === "MONEY_TRANSFER" && item.amount < 0;
		}
		if (filter === "trade") {
			return item.transactionType === "CURRENCY_EXCHANGE" || item.transactionType === "INVESTMENT";
		}
		return false;
	});
	return (
		<WidgetContainer width={"30rem"} height={"auto"} bgColor="#fbfbfe">
			<Box css={historyHeaderStyle}>
				<Typography variant="h5" sx={{ fontWeight: "bold" }}>
					Transaction History
				</Typography>
			</Box>
			<Box css={historyButtonsStyle}>
				{filterOptions.map((option) => (
					<Button
						key={option}
						onClick={() => setFilter(option)}
						sx={{
							border: "1px solid #FFD700",
							borderRadius: "2rem",
							padding: "0.5rem 1rem 0.5rem 1rem",
							backgroundColor: filter === option ? "#FFD700" : "transparent",
							color: filter === option ? "black" : "white",
							"&:hover": {
								backgroundColor: "#FFD700",
								color: "black",
							},
						}}
						style={{
							margin: "0 5px",
						}}
					>
						{option}
					</Button>
				))}
			</Box>
			<HistoryList data={filteredData.slice(0, 3)} />
		</WidgetContainer>
	);
};

export default HistoryWidget;
