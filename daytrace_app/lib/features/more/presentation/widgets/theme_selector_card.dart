import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/theme_provider.dart';
import '../../../../core/theme/daytrace_theme.dart';

class ThemeSelectorCard extends ConsumerWidget {
  const ThemeSelectorCard({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeTokens = ref.watch(themeProvider.notifier).tokens;
    final currentTheme = ref.watch(themeProvider);

    return ClipRRect(
      borderRadius: BorderRadius.circular(16),
      child: BackdropFilter(
        filter: ui.ImageFilter.blur(sigmaX: 10, sigmaY: 10),
        child: Container(
          decoration: BoxDecoration(
            color: themeTokens.surface.withValues(alpha: 0.8),
            border: Border.all(color: themeTokens.outlineVariant.withValues(alpha: 0.6)),
            borderRadius: BorderRadius.circular(16),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Row(
                  children: [
                    Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            themeTokens.primary,
                            themeTokens.secondary,
                          ],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(Icons.palette_outlined, color: Colors.white),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'App Theme',
                            style: themeTokens.typography.bodyLg.copyWith(
                              color: themeTokens.onSurface,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            'Change the visual engine shader.',
                            style: themeTokens.typography.bodySm.copyWith(
                              color: themeTokens.onSurfaceVariant,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              Divider(
                height: 1,
                color: themeTokens.outlineVariant.withValues(alpha: 0.5),
              ),
              _buildThemeOption(
                context: context,
                ref: ref,
                tokens: themeTokens,
                title: 'Spectral Light',
                themeType: DayTraceThemeType.light,
                isSelected: currentTheme == DayTraceThemeType.light,
                accentColor: const Color(0xFF38BDF8),
              ),
              Divider(
                height: 1,
                color: themeTokens.outlineVariant.withValues(alpha: 0.5),
                indent: 56,
              ),
              _buildThemeOption(
                context: context,
                ref: ref,
                tokens: themeTokens,
                title: 'Aurora Night (Dark)',
                themeType: DayTraceThemeType.dark,
                isSelected: currentTheme == DayTraceThemeType.dark,
                accentColor: const Color(0xFF6366F1),
              ),
              Divider(
                height: 1,
                color: themeTokens.outlineVariant.withValues(alpha: 0.5),
                indent: 56,
              ),
              _buildThemeOption(
                context: context,
                ref: ref,
                tokens: themeTokens,
                title: 'Aurora Flow (White)',
                themeType: DayTraceThemeType.aurora,
                isSelected: currentTheme == DayTraceThemeType.aurora,
                accentColor: const Color(0xFF00E699),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildThemeOption({
    required BuildContext context,
    required WidgetRef ref,
    required DayTraceThemeTokens tokens,
    required String title,
    required DayTraceThemeType themeType,
    required bool isSelected,
    required Color accentColor,
  }) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: () {
          ref.read(themeProvider.notifier).setTheme(themeType);
        },
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
          child: Row(
            children: [
              Container(
                width: 24,
                height: 24,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: accentColor.withValues(alpha: 0.2),
                  border: Border.all(color: accentColor),
                ),
                child: Center(
                  child: Container(
                    width: 12,
                    height: 12,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: accentColor,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Text(
                  title,
                  style: tokens.typography.bodyMd.copyWith(
                    color: tokens.onSurface,
                    fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                  ),
                ),
              ),
              if (isSelected)
                Icon(
                  Icons.check_circle,
                  color: tokens.secondary,
                  size: 20,
                ),
            ],
          ),
        ),
      ),
    );
  }
}
