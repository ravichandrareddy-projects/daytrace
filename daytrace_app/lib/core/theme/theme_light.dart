import 'package:flutter/material.dart';
import 'daytrace_theme.dart';

const themeLight = DayTraceThemeTokens(
  background: Color(0xFFFBFBFC), // Porcelain White
  surface: Color(0x66FFFFFF),
  surfaceSecondary: Color(0x40F0F0F3),
  surfaceElevated: Color(0xB3FFFFFF),
  textPrimary: Color(0xFF141416), // Carbon Black
  textSecondary: Color(0xFF5E6066), // Slate Gray
  textMuted: Color(0xFF8F939E), // Ash Gray
  border: Color(0x1AE4E5E8),
  borderStrong: Color(0x33E4E5E8),
  primary: Color(0xFF00C67E), // Emerald
  secondary: Color(0xFF00A3FF), // Teal/Blue
  tertiary: Color(0xFF6B4DFF), // Indigo
  success: Color(0xFF00C67E),
  warning: Color(0xFFFF9500),
  danger: Color(0xFFFF3B30),
  navigationBackground: Color(0xB3FFFFFF), // Frosted Glass
  glassOpacity: 0.4,
  shaderIntensity: 1.0,
  shaderAsset: 'assets/shaders/spectral_border.frag',
);
