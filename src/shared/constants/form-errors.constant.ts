export const formErrors = {
  fr: {
    required: "Champ obligatoire",
    unallowedType: "Type interdit",
    email: "Email non valide",
    confirmPassword: "Mot de passe ne correspond pas",
    min: (n: number) => `Minimum ${n}`,
    maxSize: (n: number, unit: string) => `Ne doit pas dépasser ${n} ${unit}`,
    enum: (s: string) => `Seuls ${s} sont valides`,
    different: (field1: string, field2: string) =>
      `${field1} doit être différents de ${field2}`,

    greaterOrEqualThan: (n: number) => `Doit être supérieur ou égal à ${n}`,
    lessOrEqualThan: (n: number) => `Doit être inférieur ou égal à ${n}`,
    typeError: (type: string) => `Doit être un ${type}`,
  },
};
