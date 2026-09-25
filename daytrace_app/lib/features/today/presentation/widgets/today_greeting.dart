import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/theme_provider.dart';
import '../../../../core/theme/daytrace_theme.dart';
import 'package:intl/intl.dart';

class TodayGreeting extends ConsumerWidget {
  const TodayGreeting({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeTokens = ref.watch(themeProvider.notifier).tokens;
    
    // Formatting date like "Mon, Sep 21, 2026 · 08:42 AM"
    final now = DateTime.now();
    final dateStr = DateFormat('EEE, MMM d, yyyy').format(now);
    final timeStr = DateFormat('hh:mm a').format(now);
    final dateTimeString = '$dateStr · $timeStr';

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              dateTimeString.toUpperCase(),
              style: themeTokens.typography.labelSm.copyWith(
                color: themeTokens.onSurfaceVariant,
                letterSpacing: 1.2,
                fontWeight: FontWeight.w600,
              ),
            ),
            Row(
              children: [
                _buildWeatherTag(themeTokens),
                const SizedBox(width: 8),
                _buildAuroraFlowTag(themeTokens),
              ],
            ),
          ],
        ),
        const SizedBox(height: 12),
        Text(
          'Good morning, Arjun',
          style: themeTokens.typography.displayLgMobile.copyWith(
            color: themeTokens.onSurface,
            fontWeight: FontWeight.w800,
            letterSpacing: -0.5,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          'Target day rhythm is 68% calibrated. Focus high early.',
          style: themeTokens.typography.bodyMd.copyWith(
            color: themeTokens.onSurfaceVariant,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }

  Widget _buildWeatherTag(DayTraceThemeTokens tokens) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: tokens.surface.withValues(alpha: 0.05),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: tokens.outlineVariant.withValues(alpha: 0.5)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 4,
            offset: const Offset(0, 1),
          ),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.wb_sunny, color: Colors.orange, size: 14),
          const SizedBox(width: 4),
          Text(
            '26°C · Clear',
            style: tokens.typography.labelSm.copyWith(
              color: tokens.onSurface,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAuroraFlowTag(DayTraceThemeTokens tokens) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: tokens.secondary.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: tokens.secondary.withValues(alpha: 0.3)),
        boxShadow: [
          BoxShadow(
            color: tokens.secondary.withValues(alpha: 0.15),
            blurRadius: 8,
            offset: const Offset(0, 1),
          ),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 6,
            height: 6,
            decoration: BoxDecoration(
              color: tokens.secondaryFixed,
              shape: BoxShape.circle,
              boxShadow: [
                BoxShadow(
                  color: tokens.secondaryFixed.withValues(alpha: 0.6),
                  blurRadius: 6,
                ),
              ],
            ),
          ),
          const SizedBox(width: 6),
          Text(
            '✨ Aurora Flow',
            style: tokens.typography.labelSm.copyWith(
              color: tokens.secondary,
            ),
          ),
        ],
      ),
    );
  }
}
