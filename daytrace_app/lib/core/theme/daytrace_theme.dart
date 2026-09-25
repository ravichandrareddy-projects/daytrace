import 'package:flutter/material.dart';

class DayTraceThemeTokens extends ThemeExtension<DayTraceThemeTokens> {
  final Color background;
  final Color surface;
  final Color surfaceSecondary;
  final Color surfaceElevated;
  final Color textPrimary;
  final Color textSecondary;
  final Color textMuted;
  final Color border;
  final Color borderStrong;
  final Color primary;
  final Color secondary;
  final Color tertiary;
  final Color success;
  final Color warning;
  final Color danger;
  final Color navigationBackground;
  final double glassOpacity;
  final double shaderIntensity;
  final String shaderAsset;
  final DayTraceTypography typography;

  // Semantic mappings
  Color get onSurface => textPrimary;
  Color get onSurfaceVariant => textSecondary;
  Color get outlineVariant => border;
  Color get primaryContainer => primary.withValues(alpha: 0.1);
  Color get onPrimary => Colors.white;
  Color get secondaryFixed => secondary;
  Color get surfaceContainer => surfaceSecondary;
  Color get surfaceContainerHighest => surfaceElevated;

  const DayTraceThemeTokens({
    required this.background,
    required this.surface,
    required this.surfaceSecondary,
    required this.surfaceElevated,
    required this.textPrimary,
    required this.textSecondary,
    required this.textMuted,
    required this.border,
    required this.borderStrong,
    required this.primary,
    required this.secondary,
    required this.tertiary,
    required this.success,
    required this.warning,
    required this.danger,
    required this.navigationBackground,
    required this.glassOpacity,
    required this.shaderIntensity,
    required this.shaderAsset,
    this.typography = const DayTraceTypography(),
  });

  @override
  DayTraceThemeTokens copyWith({
    Color? background,
    Color? surface,
    Color? surfaceSecondary,
    Color? surfaceElevated,
    Color? textPrimary,
    Color? textSecondary,
    Color? textMuted,
    Color? border,
    Color? borderStrong,
    Color? primary,
    Color? secondary,
    Color? tertiary,
    Color? success,
    Color? warning,
    Color? danger,
    Color? navigationBackground,
    double? glassOpacity,
    double? shaderIntensity,
    String? shaderAsset,
  }) {
    return DayTraceThemeTokens(
      background: background ?? this.background,
      surface: surface ?? this.surface,
      surfaceSecondary: surfaceSecondary ?? this.surfaceSecondary,
      surfaceElevated: surfaceElevated ?? this.surfaceElevated,
      textPrimary: textPrimary ?? this.textPrimary,
      textSecondary: textSecondary ?? this.textSecondary,
      textMuted: textMuted ?? this.textMuted,
      border: border ?? this.border,
      borderStrong: borderStrong ?? this.borderStrong,
      primary: primary ?? this.primary,
      secondary: secondary ?? this.secondary,
      tertiary: tertiary ?? this.tertiary,
      success: success ?? this.success,
      warning: warning ?? this.warning,
      danger: danger ?? this.danger,
      navigationBackground: navigationBackground ?? this.navigationBackground,
      glassOpacity: glassOpacity ?? this.glassOpacity,
      shaderIntensity: shaderIntensity ?? this.shaderIntensity,
      shaderAsset: shaderAsset ?? this.shaderAsset,
    );
  }

  @override
  DayTraceThemeTokens lerp(ThemeExtension<DayTraceThemeTokens>? other, double t) {
    if (other is! DayTraceThemeTokens) {
      return this;
    }
    return DayTraceThemeTokens(
      background: Color.lerp(background, other.background, t)!,
      surface: Color.lerp(surface, other.surface, t)!,
      surfaceSecondary: Color.lerp(surfaceSecondary, other.surfaceSecondary, t)!,
      surfaceElevated: Color.lerp(surfaceElevated, other.surfaceElevated, t)!,
      textPrimary: Color.lerp(textPrimary, other.textPrimary, t)!,
      textSecondary: Color.lerp(textSecondary, other.textSecondary, t)!,
      textMuted: Color.lerp(textMuted, other.textMuted, t)!,
      border: Color.lerp(border, other.border, t)!,
      borderStrong: Color.lerp(borderStrong, other.borderStrong, t)!,
      primary: Color.lerp(primary, other.primary, t)!,
      secondary: Color.lerp(secondary, other.secondary, t)!,
      tertiary: Color.lerp(tertiary, other.tertiary, t)!,
      success: Color.lerp(success, other.success, t)!,
      warning: Color.lerp(warning, other.warning, t)!,
      danger: Color.lerp(danger, other.danger, t)!,
      navigationBackground: Color.lerp(navigationBackground, other.navigationBackground, t)!,
      glassOpacity: _lerpDouble(glassOpacity, other.glassOpacity, t),
      shaderIntensity: _lerpDouble(shaderIntensity, other.shaderIntensity, t),
      shaderAsset: t < 0.5 ? shaderAsset : other.shaderAsset,
    );
  }

  double _lerpDouble(double a, double b, double t) {
    return a + (b - a) * t;
  }
}

class DayTraceTypography {
  const DayTraceTypography();

  TextStyle get displayLgMobile => const TextStyle(fontFamily: 'Plus Jakarta Sans', fontSize: 32, fontWeight: FontWeight.w800, height: 1.25, letterSpacing: -0.64);
  TextStyle get headlineXl => const TextStyle(fontFamily: 'Plus Jakarta Sans', fontSize: 30, fontWeight: FontWeight.w700, height: 1.26, letterSpacing: -0.45);
  TextStyle get headlineLg => const TextStyle(fontFamily: 'Plus Jakarta Sans', fontSize: 24, fontWeight: FontWeight.w700, height: 1.33, letterSpacing: -0.24);
  TextStyle get headlineMd => const TextStyle(fontFamily: 'Plus Jakarta Sans', fontSize: 20, fontWeight: FontWeight.w600, height: 1.4, letterSpacing: -0.1);
  
  TextStyle get bodyLg => const TextStyle(fontFamily: 'Plus Jakarta Sans', fontSize: 16, fontWeight: FontWeight.w400, height: 1.625);
  TextStyle get bodyMd => const TextStyle(fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: FontWeight.w400, height: 1.57);
  TextStyle get bodySm => const TextStyle(fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: FontWeight.w400, height: 1.5);
  
  TextStyle get labelLg => const TextStyle(fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: FontWeight.w600, height: 1.42, letterSpacing: 0.07);
  TextStyle get labelMd => const TextStyle(fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: FontWeight.w600, height: 1.33, letterSpacing: 0.24);
  TextStyle get labelSm => const TextStyle(fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: FontWeight.w700, height: 1.27, letterSpacing: 0.44);
}
