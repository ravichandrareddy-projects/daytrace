import 'package:flutter/material.dart';
import 'daytrace_theme.dart';

const themeDark = DayTraceThemeTokens(
  background: Color(0xFF0B0E14), // OLED Dark
  surface: Color(0x331B1E26), // Anthracite Glass
  surfaceSecondary: Color(0x1A282B33),
  surfaceElevated: Color(0x661B1E26),
  textPrimary: Color(0xFFFFFFFF),
  textSecondary: Color(0xFFA5A8B3),
  textMuted: Color(0xFF6A6D7A),
  border: Color(0x1A353842),
  borderStrong: Color(0x33353842),
  primary: Color(0xFF00E676), // Neon Emerald
  secondary: Color(0xFF00E5FF), // Cyan
  tertiary: Color(0xFF9D00FF), // Neon Purple
  success: Color(0xFF00E676),
  warning: Color(0xFFFFAB00),
  danger: Color(0xFFFF1744),
  navigationBackground: Color(0xB30B0E14),
  glassOpacity: 0.2,
  shaderIntensity: 1.0,
  shaderAsset: 'assets/shaders/aurora_night.frag',
);
