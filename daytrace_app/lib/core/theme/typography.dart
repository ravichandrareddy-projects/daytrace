import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'daytrace_theme.dart';

class DayTraceTypography {
  static TextTheme buildTextTheme(DayTraceThemeTokens tokens) {
    // Plus Jakarta Sans for UI elements
    final baseTheme = GoogleFonts.plusJakartaSansTextTheme();

    return baseTheme.copyWith(
      displayLarge: baseTheme.displayLarge?.copyWith(
        color: tokens.textPrimary,
        fontWeight: FontWeight.w800,
      ),
      displayMedium: baseTheme.displayMedium?.copyWith(
        color: tokens.textPrimary,
        fontWeight: FontWeight.w800,
      ),
      displaySmall: baseTheme.displaySmall?.copyWith(
        color: tokens.textPrimary,
        fontWeight: FontWeight.w700,
      ),
      headlineLarge: baseTheme.headlineLarge?.copyWith(
        color: tokens.textPrimary,
        fontWeight: FontWeight.w700,
      ),
      headlineMedium: baseTheme.headlineMedium?.copyWith(
        color: tokens.textPrimary,
        fontWeight: FontWeight.w600,
      ),
      headlineSmall: baseTheme.headlineSmall?.copyWith(
        color: tokens.textPrimary,
        fontWeight: FontWeight.w600,
      ),
      titleLarge: baseTheme.titleLarge?.copyWith(
        color: tokens.textPrimary,
        fontWeight: FontWeight.w600,
      ),
      titleMedium: baseTheme.titleMedium?.copyWith(
        color: tokens.textPrimary,
        fontWeight: FontWeight.w600,
      ),
      titleSmall: baseTheme.titleSmall?.copyWith(
        color: tokens.textSecondary,
        fontWeight: FontWeight.w500,
      ),
      bodyLarge: baseTheme.bodyLarge?.copyWith(
        color: tokens.textPrimary,
        fontWeight: FontWeight.w400,
      ),
      bodyMedium: baseTheme.bodyMedium?.copyWith(
        color: tokens.textSecondary,
        fontWeight: FontWeight.w400,
      ),
      bodySmall: baseTheme.bodySmall?.copyWith(
        color: tokens.textMuted,
        fontWeight: FontWeight.w400,
      ),
      labelLarge: baseTheme.labelLarge?.copyWith(
        color: tokens.textPrimary,
        fontWeight: FontWeight.w600,
      ),
      labelMedium: baseTheme.labelMedium?.copyWith(
        color: tokens.textSecondary,
        fontWeight: FontWeight.w500,
      ),
      labelSmall: baseTheme.labelSmall?.copyWith(
        color: tokens.textMuted,
        fontWeight: FontWeight.w500,
        letterSpacing: 0.5,
      ),
    );
  }

  static TextStyle metricMono(DayTraceThemeTokens tokens) {
    return GoogleFonts.jetBrainsMono(
      color: tokens.textPrimary,
      fontWeight: FontWeight.w500,
      letterSpacing: -0.5,
    );
  }
}
