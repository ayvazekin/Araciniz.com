"use server";

// Demo mode — auth devre dışı
export async function signInWithGoogle() {
  return { error: "Demo modunda giriş devre dışı." };
}

export async function signOut() {
  return;
}
