import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "motion/react";
import { modalBackdrop, modalPanel } from "../../utils/motion";
import type { EditGroupModalProps, EditGroupData } from "../../types/groups.types";
import useGroup from "../../hooks/useGroup";

const EditGroupModal = ({ group, onClose }: EditGroupModalProps) => {
    const { editGroup, loading } = useGroup();

    const [errorResponse, setErrorResponse] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const { register, handleSubmit, watch } = useForm<EditGroupData>({
        defaultValues: {
            name: group.name,
            description: group.description,
        }
    });

    const imageField = watch("image");

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setPreviewUrl(null);
        }
    };

    const onSubmit = async (data: EditGroupData) => {
        setErrorResponse(null);
        try {
            await editGroup(group._id, data);
            onClose();
        } catch (error: any) {
            setErrorResponse(error?.response?.data?.message ?? "Ocurrió un error al editar el grupo");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

            <motion.div
                {...modalBackdrop}
                onClick={onClose}
                className="absolute inset-0 bg-[#210B2C]/80 backdrop-blur-md"
            />

            <motion.div {...modalPanel} className="relative w-full max-w-md z-10">
                <div className="bg-[#210B2C] border border-white/10 rounded-2xl p-6 shadow-2xl">

                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-[#BC96E6]/15 flex items-center justify-center">
                                <i className="bi bi-pencil text-[#FFD166] text-sm" />
                            </div>
                            <h2 className="text-white font-semibold text-lg">Editar grupo</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-[#BC96E6] hover:bg-[#BC96E6]/8 hover:border-[#BC96E6]/20 transition-all duration-150 cursor-pointer"
                        >
                            <i className="bi bi-x text-lg" />
                        </button>
                    </div>

                    <div className="border-t border-[#FFD166] mb-5" />

                    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold tracking-wider uppercase text-white/90">
                                Nombre <span className="text-[#FFD166] normal-case tracking-normal font-normal">(opcional)</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Ej: Amigos del barrio"
                                autoComplete="off"
                                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[#FFD166] focus:ring-1 focus:ring-[#FFD166] transition-colors duration-150"
                                {...register("name")}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold tracking-wider uppercase text-white/90">
                                Descripción <span className="text-[#FFD166] normal-case tracking-normal font-normal">(opcional)</span>
                            </label>
                            <textarea
                                placeholder="Ej: Grupo para organizar salidas y gastos"
                                rows={3}
                                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[#FFD166] focus:ring-1 focus:ring-[#FFD166] transition-colors duration-150 resize-none"
                                {...register("description")}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold tracking-wider uppercase text-white/90">
                                Imagen <span className="text-[#FFD166] normal-case tracking-normal font-normal">(opcional)</span>
                            </label>

                            {(previewUrl || group.image) && (
                                <div className="space-y-2">
                                    <span className="text-xs text-white/30">
                                        {previewUrl ? "Nueva imagen" : "Imagen actual"}
                                    </span>
                                    <div className="w-full h-32 rounded-xl overflow-hidden border border-white/10">
                                        <img
                                            src={previewUrl ?? group.image ?? ""}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            )}

                            <label className="flex items-center gap-3 bg-white/5 border border-[#BC96E6]/25 border-dashed rounded-xl px-4 py-3 cursor-pointer hover:bg-[#BC96E6]/4 hover:border-[#BC96E6]/45 transition-all duration-150">
                                <i className="bi bi-image text-[#BC96E6]/60 text-lg" />
                                <span className="text-white/50 text-sm">
                                    {imageField && imageField.length > 0
                                        ? imageField[0].name
                                        : "Seleccionar imagen"
                                    }
                                </span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    {...register("image")}
                                    onChange={(e) => {
                                        register("image").onChange(e);
                                        handleImageChange(e);
                                    }}
                                />
                            </label>
                        </div>

                        {errorResponse && (
                            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3">
                                <i className="bi bi-exclamation-circle shrink-0" />
                                <span>{errorResponse}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading.editLoading}
                            className="w-full hover:bg-[#BC96E6] text-[#210B2C] font-semibold rounded-xl px-5 py-3 flex items-center justify-center gap-2 bg-[#FFD166] active:scale-[0.98] transition-all duration-150 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                        >
                            {loading.editLoading ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-[#210B2C]/30 border-t-[#210B2C] rounded-full animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-check-circle" />
                                    Guardar cambios
                                </>
                            )}
                        </button>

                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default EditGroupModal;
