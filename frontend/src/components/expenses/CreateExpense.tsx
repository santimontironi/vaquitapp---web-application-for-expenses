import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "motion/react";
import { modalBackdrop, modalPanel } from "../../utils/motion";
import type { CreateExpenseModalProps } from "../../types/expense.types";
import useExpense from "../../hooks/useExpense";
import PaidByPicker from "./PaidByPicker";
import SplitPicker from "./SplitPicker";

interface FormFields {
    description?: string;
    amount: number;
}

const CreateExpense = ({ idGroup, idPlan, members, onClose }: CreateExpenseModalProps) => {
    const { createExpense, loading } = useExpense();

    const [paidBy, setPaidBy] = useState<string>("");
    const [splitAmong, setSplitAmong] = useState<string[]>(members.map(m => m._id));
    const [paidByError, setPaidByError] = useState<string | null>(null);
    const [splitError, setSplitError] = useState<string | null>(null);
    const [errorResponse, setErrorResponse] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<FormFields>();

    const toggleSplitMember = (id: string) => {
        setSplitError(null);
        setSplitAmong(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handlePaidByChange = (id: string) => {
        setPaidBy(id);
        setPaidByError(null);
    };

    const onSubmit = async (data: FormFields) => {
        if (!paidBy) {
            setPaidByError("Seleccioná quién pagó");
            return;
        }
        if (splitAmong.length === 0) {
            setSplitError("Seleccioná al menos un miembro");
            return;
        }

        setErrorResponse(null);

        try {
            await createExpense(idGroup, idPlan, { ...data, paid_by: paidBy, split_among: splitAmong });
            onClose();
        } catch (error: any) {
            setErrorResponse(error?.response?.data?.message ?? "Ocurrió un error al crear el gasto");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
         
            <motion.div {...modalBackdrop} onClick={onClose} className="absolute inset-0 bg-[#210B2C]/80 backdrop-blur-md" />

            <motion.div {...modalPanel} className="relative w-full max-w-md z-10 max-h-[90vh] flex flex-col">
                <div className="bg-[#210B2C] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">

                    <div className="flex items-center justify-between p-5 pb-4 shrink-0">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-[#FFD166]/10 flex items-center justify-center">
                                <i className="bi bi-receipt text-[#FFD166] text-sm" />
                            </div>
                            <h2 className="text-white font-semibold text-lg">Agregar gasto</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/7 border border-white/10 text-white/40 hover:text-[#BC96E6] hover:bg-[#BC96E6]/8 hover:border-[#BC96E6]/20 transition-all duration-150 cursor-pointer"
                        >
                            <i className="bi bi-x text-lg" />
                        </button>
                    </div>

                    <div className="border-t border-white/[0.07] mx-5 shrink-0" />

                    {/* Scrollable form */}
                    <div className="overflow-y-auto p-5">
                        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold tracking-wider uppercase text-white/40">
                                    Descripción <span className="text-white/25 normal-case tracking-normal font-normal">(opcional)</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ej: Compra del super"
                                    autoComplete="off"
                                    className="w-full bg-white/8 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[#FFD166] focus:ring-1 focus:ring-[#FFD166]/35 transition-colors duration-150"
                                    {...register("description")}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold tracking-wider uppercase text-white/40">
                                    Monto <span className="text-[#BC96E6]">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    placeholder="0.00"
                                    className="w-full bg-white/8 border border-white/20 rounded-xl px-4 py-3 text-[#FFD166] font-bold placeholder:text-white/30 placeholder:font-normal text-lg focus:outline-none focus:border-[#FFD166] focus:ring-1 focus:ring-[#FFD166]/35 transition-colors duration-150"
                                    {...register("amount", {
                                        required: "El monto es requerido",
                                        min: { value: 0.01, message: "El monto debe ser mayor a 0" },
                                        valueAsNumber: true,
                                    })}
                                />
                                {errors.amount && (
                                    <p className="flex items-center gap-1.5 text-red-400 text-xs">
                                        <i className="bi bi-exclamation-circle" />
                                        {errors.amount.message}
                                    </p>
                                )}
                            </div>

                            <PaidByPicker
                                members={members}
                                value={paidBy}
                                onChange={handlePaidByChange}
                                error={paidByError}
                            />

                            <SplitPicker
                                members={members}
                                value={splitAmong}
                                onChange={toggleSplitMember}
                                error={splitError}
                            />

                            {errorResponse && (
                                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3">
                                    <i className="bi bi-exclamation-circle shrink-0" />
                                    <span>{errorResponse}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading.createLoading}
                                className="w-full bg-[#BC96E6] text-[#210B2C] font-semibold rounded-xl px-5 py-3 flex items-center justify-center gap-2 hover:bg-[#FFD166] active:scale-[0.98] transition-all duration-150 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading.createLoading ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-[#210B2C]/30 border-t-[#210B2C] rounded-full animate-spin" />
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-plus-circle" />
                                        Guardar gasto
                                    </>
                                )}
                            </button>

                        </form>
                    </div>

                </div>
            </motion.div>
        </div>
    );
};

export default CreateExpense;
