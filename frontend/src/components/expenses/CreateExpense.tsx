import { useState } from "react";
import { useForm } from "react-hook-form";
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

            <div
                className="absolute inset-0 bg-[#0A1020]/80 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative w-full max-w-xl z-10">
                <div className="p-px rounded-3xl bg-linear-to-br from-[#3B82F6]/45 via-white/5 to-[#10B981]/30 shadow-[0_25px_60px_rgba(0,0,0,0.6)]">
                    <div className="bg-[#0A1020]/95 backdrop-blur-3xl rounded-[23px] p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto">

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center">
                                    <i className="bi bi-receipt text-[#3B82F6]" />
                                </div>
                                <h2 className="text-white font-semibold">Agregar gasto</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 flex items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer"
                            >
                                <i className="bi bi-x text-lg" />
                            </button>
                        </div>

                        <div className="w-full h-px bg-linear-to-r from-transparent via-white/8 to-transparent" />

                        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-x-4 gap-y-5" noValidate>

                            <div className="col-span-2 flex flex-col gap-1.5">
                                <label className="text-white/70 text-sm">
                                    Descripción <span className="text-white/30">(opcional)</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ej: Compra del super"
                                    autoComplete="off"
                                    {...register("description")}
                                    className="w-full px-4 py-3 rounded-xl text-white placeholder:text-white/25 bg-white/5 border border-white/10 outline-none transition-all duration-200 hover:bg-white/7 hover:border-white/25 focus:bg-[#3B82F6]/5 focus:border-[#3B82F6]/60 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.12)]"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-white/70 text-sm">
                                    Monto <span className="text-[#EF4444]">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    placeholder="0.00"
                                    {...register("amount", {
                                        required: "El monto es requerido",
                                        min: { value: 0.01, message: "El monto debe ser mayor a 0" },
                                        valueAsNumber: true,
                                    })}
                                    className={[
                                        "w-full px-4 py-3 rounded-xl text-white placeholder:text-white/25 bg-white/5 border outline-none transition-all duration-200 hover:bg-white/7 hover:border-white/25 focus:bg-[#3B82F6]/5 focus:border-[#3B82F6]/60 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.12)]",
                                        errors.amount ? "border-[#EF4444]/60" : "border-white/10"
                                    ].join(" ")}
                                />
                                {errors.amount && (
                                    <p className="flex items-center gap-1.5 text-[#EF4444] text-sm">
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
                                <div className="col-span-2 flex items-center gap-2 px-4 py-3 rounded-xl bg-[#EF4444]/8 border border-[#EF4444]/25">
                                    <i className="bi bi-exclamation-circle text-[#EF4444]" />
                                    <span className="text-[#EF4444] text-sm">{errorResponse}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading.createLoading}
                                className={[
                                    "col-span-2 flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl text-white font-medium",
                                    "bg-linear-to-r from-[#3B82F6] via-[#4f8ef7] to-[#2563EB]",
                                    "border border-[#3B82F6]/25 shadow-[0_4px_24px_rgba(59,130,246,0.30),inset_0_1px_0_rgba(255,255,255,0.12)]",
                                    "transition-all duration-200",
                                    loading.createLoading
                                        ? "opacity-60 cursor-not-allowed"
                                        : "hover:-translate-y-0.5 hover:shadow-[0_10px_40px_rgba(59,130,246,0.50)] active:translate-y-0 active:scale-[0.98]",
                                ].join(" ")}
                            >
                                {loading.createLoading ? (
                                    <>
                                        <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
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
            </div>
        </div>
    );
};

export default CreateExpense;
