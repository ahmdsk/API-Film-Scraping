export const responseSuccessWithData = (data: any) => ({ data });
export const responseSuccessWithMessage = (
  message: string = "Yeyy... Permintaan Berhasil Dikirimkan"
) => ({ message });

export const responseErrorWithMessage = (
    message: string = "Upsss... Sepertinya terjadi masalah pada server"
  ) => ({ message });