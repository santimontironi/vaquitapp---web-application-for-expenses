import { useContext } from "react";
import { ExpenseContext } from "../context/ExpenseContext";

const useExpense = () => {
    const context = useContext(ExpenseContext);
    if (!context) throw new Error("useExpense debe usarse dentro de ExpenseProvider");
    return context;
};

export default useExpense;
