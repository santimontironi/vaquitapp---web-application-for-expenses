import Swal from "sweetalert2";
import type { Expense } from "../../types/expense.types";
import { formatJoinedDate } from "../../utils/date";

interface ExpenseCardProps {
    expense: Expense;
    onDelete: () => void;
}

const ExpenseCard = ({ expense, onDelete }: ExpenseCardProps) => {

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: "¿Eliminar gasto?",
            text: "Usá esto si el gasto no ocurrió o fue un error. Se eliminará permanentemente.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            background: "#0d1526",
            color: "#ffffff",
            confirmButtonColor: "#EF4444",
            cancelButtonColor: "#1e2d45",
        });

        if (result.isConfirmed) {
            onDelete();
        }
    };

    return (
        <div className="flex items-start gap-4 p-4 rounded-xl bg-white/3 border border-white/6 transition-all duration-200 hover:bg-white/5 hover:border-white/10">

            <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center shrink-0">
                <i className="bi bi-receipt text-[#3B82F6]" />
            </div>

            <div className="flex-1 min-w-0 flex flex-col gap-1">
                <span className="text-white font-medium truncate">
                    {expense.description ?? "Sin descripción"}
                </span>
                <span className="text-white/40 text-xs">
                    Dividido entre: {expense.split_among.map(u => u.username).join(", ")}
                </span>
                <span className="text-white/30 text-xs">{formatJoinedDate(expense.createdAt)}</span>
            </div>

            <div className="flex flex-col items-end gap-2 shrink-0">
                <span className="text-[#10B981] font-semibold">${expense.amount.toFixed(2)}</span>
                <span className="text-white/40 text-xs">Pagó: {expense.paid_by.username}</span>
                <button
                    onClick={handleDelete}
                    title="Eliminar gasto"
                    className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#EF4444]/8 border border-[#EF4444]/20 text-[#EF4444]/60 hover:bg-[#EF4444]/15 hover:border-[#EF4444]/40 hover:text-[#EF4444] transition-all duration-200 cursor-pointer"
                >
                    <i className="bi bi-trash3 text-xs" />
                </button>
            </div>

        </div>
    );
};

export default ExpenseCard;
