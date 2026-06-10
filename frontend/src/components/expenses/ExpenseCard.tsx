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
            buttonsStyling: false,
            customClass: {
                popup: "va-swal-popup",
                title: "va-swal-title",
                htmlContainer: "va-swal-text",
                confirmButton: "va-swal-confirm va-swal-confirm-danger",
                cancelButton: "va-swal-cancel",
            },
        });

        if (result.isConfirmed) {
            onDelete();
        }
    };

    return (
        <div className="flex items-start gap-3 bg-white/4 border border-white/[0.07] rounded-xl px-4 py-3.5 hover:bg-white/[0.07] transition-colors duration-150">

            <div className="w-8 h-8 rounded-xl bg-[#FFD166]/10 flex items-center justify-center shrink-0 mt-0.5">
                <i className="bi bi-receipt text-[#FFD166] text-sm" />
            </div>

            <div className="flex-1 min-w-0">
                <span className="text-[#FFD166]/80 font-medium text-sm block truncate">
                    {expense.description ?? "Sin descripción"}
                </span>
                <span className="text-white/30 text-xs block mt-0.5 truncate">
                    Dividido entre: <span className="text-white/50">{expense.split_among.map(u => u.username).join(", ")}</span>
                </span>
                <span className="text-white/20 text-xs block mt-0.5">{formatJoinedDate(expense.createdAt)}</span>
            </div>

            <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className="text-[#FFD166] font-bold text-base tabular-nums">${expense.amount.toFixed(2)}</span>
                <span className="text-white/30 text-xs">Pagó: <span className="text-[#FFD166]/60">{expense.paid_by.username}</span></span>
                <button
                    onClick={handleDelete}
                    title="Eliminar gasto"
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all duration-150 cursor-pointer mt-1"
                >
                    <i className="bi bi-trash3 text-xs" />
                </button>
            </div>
        </div>
    );
};

export default ExpenseCard;
