export function getConfirmAccountEmailHtml(username, urlConfirmed) {
    const fontFamily = "'Outfit', 'Segoe UI', Arial, sans-serif";

    return `
        <!DOCTYPE html>
        <html lang="es" xmlns="http://www.w3.org/1999/xhtml">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <title>Confirmá tu cuenta de VaquitApp</title>
          </head>
          <body style="margin:0; padding:0; background-color:#160720; font-family:${fontFamily};">
            <!-- Preheader (texto de previsualización oculto) -->
            <div style="display:none; max-height:0; overflow:hidden; opacity:0; mso-hide:all;">
              Confirmá tu cuenta para empezar a organizar los gastos con tu grupo. El enlace expira en 24 horas.
            </div>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#160720; padding:32px 16px;">
              <tr>
                <td align="center">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; background-color:#210B2C; border-radius:20px; overflow:hidden; border:1px solid rgba(255,255,255,0.08);">

                    <!-- Header / Logo -->
                    <tr>
                      <td align="center" style="padding:40px 24px 24px 24px;">
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td align="center" style="background-color:rgba(188,150,230,0.12); border:1px solid rgba(188,150,230,0.25); border-radius:50%; width:64px; height:64px; font-size:32px; line-height:64px; text-align:center;">
                              🐄
                            </td>
                          </tr>
                        </table>
                        <div style="margin-top:16px; font-family:${fontFamily}; font-size:22px; font-weight:700; letter-spacing:0.02em; color:#ffffff;">
                          Vaquit<span style="color:#BC96E6;">App</span>
                        </div>
                      </td>
                    </tr>

                    <!-- Hero / Título -->
                    <tr>
                      <td align="center" style="padding:0 32px 8px 32px;">
                        <p style="margin:0; font-family:${fontFamily}; font-size:13px; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:#BC96E6;">
                          Confirmá tu cuenta
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="padding:8px 32px 0 32px;">
                        <h1 style="margin:0; font-family:${fontFamily}; font-size:26px; line-height:1.3; font-weight:700; color:#ffffff;">
                          ¡Hola, ${username}! 👋
                        </h1>
                      </td>
                    </tr>

                    <!-- Cuerpo -->
                    <tr>
                      <td style="padding:20px 32px 0 32px;">
                        <p style="margin:0 0 16px 0; font-family:${fontFamily}; font-size:15px; line-height:1.7; color:rgba(255,255,255,0.7); text-align:center;">
                          Gracias por sumarte a VaquitApp. Estás a un paso de empezar a organizar los gastos compartidos con tus amigos, sin vueltas y sin cuentas en servilletas.
                        </p>
                        <p style="margin:0; font-family:${fontFamily}; font-size:15px; line-height:1.7; color:rgba(255,255,255,0.7); text-align:center;">
                          Para activar tu cuenta, confirmá tu correo electrónico haciendo clic en el siguiente botón:
                        </p>
                      </td>
                    </tr>

                    <!-- Botón CTA -->
                    <tr>
                      <td align="center" style="padding:32px 32px 8px 32px;">
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td align="center" style="border-radius:12px; background-color:#BC96E6;">
                              <a href="${urlConfirmed}" target="_blank"
                                style="display:inline-block; padding:14px 36px; font-family:${fontFamily}; font-size:15px; font-weight:700; color:#210B2C; text-decoration:none; border-radius:12px;">
                                Confirmar mi cuenta
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <!-- Aviso de expiración -->
                    <tr>
                      <td align="center" style="padding:16px 32px 0 32px;">
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="background-color:rgba(255,209,102,0.1); border-radius:10px;">
                          <tr>
                            <td style="padding:10px 16px; font-family:${fontFamily}; font-size:13px; font-weight:600; color:#FFD166; text-align:center;">
                              ⏳ Este enlace expira en 24 horas
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <!-- Enlace alternativo en texto plano -->
                    <tr>
                      <td style="padding:28px 32px 0 32px;">
                        <p style="margin:0 0 8px 0; font-family:${fontFamily}; font-size:13px; line-height:1.6; color:rgba(255,255,255,0.4); text-align:center;">
                          Si el botón no funciona, copiá y pegá este enlace en tu navegador:
                        </p>
                        <p style="margin:0; font-family:${fontFamily}; font-size:13px; line-height:1.6; text-align:center; word-break:break-all;">
                          <a href="${urlConfirmed}" target="_blank" style="color:#BC96E6; text-decoration:underline;">${urlConfirmed}</a>
                        </p>
                      </td>
                    </tr>

                    <!-- Separador -->
                    <tr>
                      <td style="padding:32px 32px 0 32px;">
                        <div style="border-top:1px solid rgba(255,255,255,0.08); width:100%; height:1px; line-height:1px; font-size:1px;">&nbsp;</div>
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td align="center" style="padding:24px 32px 40px 32px;">
                        <p style="margin:0 0 6px 0; font-family:${fontFamily}; font-size:12px; line-height:1.6; color:rgba(255,255,255,0.35); text-align:center;">
                          Si vos no creaste una cuenta en VaquitApp, podés ignorar este correo.
                        </p>
                        <p style="margin:0; font-family:${fontFamily}; font-size:12px; line-height:1.6; color:rgba(255,255,255,0.3); text-align:center;">
                          © ${new Date().getFullYear()} VaquitApp · Organizá los gastos en grupo, sin enredos.
                        </p>
                      </td>
                    </tr>

                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
        `;
}
