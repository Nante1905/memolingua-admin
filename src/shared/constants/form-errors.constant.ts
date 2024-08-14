export const formErrors = {
  fr: {
    required: "Champ obligatoire",
    email: "Email non valide",
    confirmPassword: "Mot de passe ne correspond pas",
    min: (n: number) => `Minimum ${n}`,
    maxSize: (n: number, unit: string) => `Ne doit pas dépasser ${n} ${unit}`,
    enum: (s: string) => `Seuls ${s} sont valides`,
  },
};
