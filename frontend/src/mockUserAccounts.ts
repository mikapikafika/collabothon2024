import { IAccount } from "./hooks/useFetchAccounts";

export const mockUserAccounts: IAccount[] = [
    {
        id: 1,
        client: {
            id: 1,
            firstName: "John",
            lastname: "Doe",
            companyName: "TechCorp Inc.",
            salutation: "Mr.",
            age: "35",
            type: "Business",
        },
        balanceAmount: 500000,
        bban: "BB123",
    },
    {
        id: 2,
        client: {
            id: 2,
            firstName: "Jane",
            lastname: "Smith",
            companyName: "HealthPlus LLC",
            salutation: "Ms.",
            age: "40",
            type: "Business",
        },
        balanceAmount: 300000,
        bban: "BB456",
    },
    {
        id: 3,
        client: {
            id: 3,
            firstName: "Alice",
            lastname: "Johnson",
            companyName: "EduWorld Ltd.",
            salutation: "Mrs.",
            age: "45",
            type: "Business",
        },
        balanceAmount: 1000000,
        bban: "BB789",
    },
];