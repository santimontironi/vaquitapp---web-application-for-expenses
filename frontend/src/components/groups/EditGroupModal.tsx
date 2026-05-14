import { useState } from "react";
import { useForm } from "react-hook-form";
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

            <div
                className="absolute inset-0 bg-[#0A1020]/80 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative w-full max-w-xl z-10">
                <div className="p-px rounded-3xl bg-linear-to-br from-[#10B981]/45 via-white/5 to-[#3B82F6]/20 shadow-[0_25px_60px_rgba(0,0,0,0.6)]">
                    <div className="bg-[#0A1020]/95 backdrop-blur-3xl rounded-[23px] p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto">

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center">
                                    <i className="bi bi-pencil text-[#10B981]" />
                                </div>
                                <h2 className="text-white font-semibold">Editar grupo</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 flex items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer"
                            >
                                <i className="bi bi-x text-lg" />
                            </button>
                        </div>

                        <div className="w-full h-px bg-linear-to-r from-transparent via-white/8 to-transparent" />

                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-white/70 text-sm">
                                    Nombre <span className="text-white/30">(opcional)</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ej: Amigos del barrio"
                                    autoComplete="off"
                                    {...register("name")}
                                    className="w-full px-4 py-3 rounded-xl text-white placeholder:text-white/25 bg-white/5 border border-white/10 outline-none transition-all duration-200 hover:bg-white/7 hover:border-white/25 focus:bg-[#10B981]/5 focus:border-[#10B981]/60 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.12)]"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-white/70 text-sm">
                                    Descripción <span className="text-white/30">(opcional)</span>
                                </label>
                                <textarea
                                    placeholder="Ej: Grupo para organizar salidas y gastos"
                                    rows={3}
                                    {...register("description")}
                                    className="w-full px-4 py-3 rounded-xl text-white placeholder:text-white/25 bg-white/5 border border-white/10 outline-none transition-all duration-200 hover:bg-white/7 hover:border-white/25 focus:bg-[#10B981]/5 focus:border-[#10B981]/60 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.12)] resize-none"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-white/70 text-sm">
                                    Imagen <span className="text-white/30">(opcional)</span>
                                </label>

                                {(previewUrl || group.image) && (
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-white/30 text-sm">
                                            {previewUrl ? "Nueva imagen" : "Imagen actual"}
                                        </span>
                                        <div className="w-full h-40 rounded-xl overflow-hidden border border-white/10">
                                            <img
                                                src={previewUrl ?? group.image ?? ""}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                )}

                                <label className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/7 hover:border-white/25 transition-all duration-200 cursor-pointer">
                                    <i className="bi bi-image text-[#10B981]" />
                                    <span className="text-white/40">
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
                                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#EF4444]/8 border border-[#EF4444]/25">
                                    <i className="bi bi-exclamation-circle text-[#EF4444]" />
                                    <span className="text-[#EF4444] text-sm">{errorResponse}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading.editLoading}
                                className={[
                                    "flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl text-white font-medium",
                                    "bg-linear-to-r from-[#10B981] via-[#0ea572] to-[#059669]",
                                    "border border-[#10B981]/25 shadow-[0_4px_24px_rgba(16,185,129,0.30),inset_0_1px_0_rgba(255,255,255,0.12)]",
                                    "transition-all duration-200",
                                    loading.editLoading
                                        ? "opacity-60 cursor-not-allowed"
                                        : "hover:-translate-y-0.5 hover:shadow-[0_10px_40px_rgba(16,185,129,0.50)] active:translate-y-0 active:scale-[0.98]",
                                ].join(" ")}
                            >
                                {loading.editLoading ? (
                                    <>
                                        <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
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
                </div>
            </div>
        </div>
    );
};

export default EditGroupModal;
