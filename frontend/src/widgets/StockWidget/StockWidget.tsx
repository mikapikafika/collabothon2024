import React, { useState, useEffect } from "react";
import { WidgetContainer } from "../../components/WidgetContainer/WidgetContainer";
import StockList from "../../components/Stock/StockList";
import StockChart from "../../components/Stock/StockChart";
import { Box, Typography } from "@mui/material"; 
import { StockDataPoint } from "../../types/types";
import { mockData } from "./stockData";

interface StockWidgetProps {
  userId: number;
}

const mulberry32 = (a: number): number => {
  let t = (a += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const generateMockStockData = (days: number, id: number, userId: number): StockDataPoint[] => {
  const selectedStock = mockData[userId].find((item) => item.id === id);

  if (!selectedStock) {
    throw new Error("Selected stock symbol not found");
  }

  const data: StockDataPoint[] = [];
  let price: number = selectedStock.price;
  const today = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const change: number = price * (mulberry32(i | id) * 0.06 - 0.03);
    price += change;

    data.push({
      date: date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      price: Number(price.toFixed(2)),
      fullIndex: i,
    });
  }

  return data; 
};


const StockWidget: React.FC<StockWidgetProps> = ({ userId }: StockWidgetProps) => {
  const [selectedSymbol, setSelectedSymbol] = useState<number>(0);
  const [data, setData] = useState<StockData[] | null>(null);

  useEffect(() => {
    const fetchData = async (days: number) => {
      try {
        const data = mockData[userId - 1].map((item) => ({
          ...item,
          data: generateMockStockData(days, item.id, userId - 1),
        }));
        setData(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData(1000);
  }, []);

  if (data === null) {
    return <div>Loading...</div>;
  }

  return (
    <WidgetContainer width={"55rem"} height={"528.25px"} bgColor={"#002E3C"} txtColor={"white"}>
      <Typography variant="h5" sx={{ fontWeight: "bold", padding: "1rem 0 0 1rem" }}>
        Price {data[selectedSymbol].name}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          height: "100%",
        }}
      >
        <Box sx={{ flex: 1, paddingRight: "1rem", display: "flex", height: '25rem', justifyContent: "center", alignItems: "center" }}>
          <StockChart selectedSymbol={selectedSymbol} data={data[selectedSymbol].data} />
        </Box>

        <Box sx={{ flex: 1, marginTop: "-2rem" }}>
          <StockList onClick={setSelectedSymbol} selectedSymbol={selectedSymbol} StockItemList={data} />
        </Box>
      </Box>
    </WidgetContainer>
  );
};

export default StockWidget;
