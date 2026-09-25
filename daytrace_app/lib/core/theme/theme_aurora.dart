import 'package:flutter/material.dart';
import 'daytrace_theme.dart';

const themeAurora = DayTraceThemeTokens(
  background: Color(0xFFFBFBFC), // Porcelain White
  surface: Color(0x66FFFFFF),
  surfaceSecondary: Color(0x40F0F0F3),
  surfaceElevated: Color(0xB3FFFFFF),
  textPrimary: Color(0xFF141416),
  textSecondary: Color(0xFF5E6066),
  textMuted: Color(0xFF8F939E),
  border: Color(0x1AE4E5E8),
  borderStrong: Color(0x33E4E5E8),
  primary: Color(0xFF00C67E),
  secondary: Color(0xFF00A3FF),
  tertiary: Color(0xFFFF2E93), // Aurora Pink
  success: Color(0xFF00C67E),
  warning: Color(0xFFFF9500),
  danger: Color(0xFFFF3B30),
  navigationBackground: Color(0xB3FFFFFF),
  glassOpacity: 0.4,
  shaderIntensity: 1.0,
  shaderAsset: 'assets/shaders/aurora_light.frag',
);
