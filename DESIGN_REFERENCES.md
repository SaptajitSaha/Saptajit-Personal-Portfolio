# Liquid-Glass Redesign References

The liquid-glass direction was implemented as an original React/CSS system rather than by importing third-party component code.

## Catalog research

The 21st.dev component catalog was reviewed for visual-pattern research only on 24 August 2026. Relevant metadata references included:

- [Glassmorphism Navigation](https://21st.dev/r/akashsingh890901-crypto/glassmorphism-navigation?api_key=$API_KEY_21ST)
- [Liquid Morph Floating Menu](https://21st.dev/r/aayush-duhan/liquid-morph-floating-menu?api_key=$API_KEY_21ST)
- [Apple Tahoe Liquid Glass Button](https://21st.dev/r/easemize/apple-tahoe-liquid-glass-button?api_key=$API_KEY_21ST)

No catalog component source was retrieved or copied. The resulting implementation uses an original, accessible floating navigation lens, layered translucent surfaces, and the existing Signal Field vermilion palette.

## Design decision

The local UI design-system generator returned a brutalist, light-mode recommendation that did not fit the user’s explicit dark liquid-glass brief. It was intentionally not adopted. The custom direction keeps the established dark visual identity, uses a single vermilion accent, and treats glass as depth and refraction rather than generic translucent cards.
