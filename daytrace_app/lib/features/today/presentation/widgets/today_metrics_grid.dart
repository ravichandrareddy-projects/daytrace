import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/theme_provider.dart';
import '../../../../core/theme/daytrace_theme.dart';

class TodayMetricsGrid extends ConsumerWidget {
  const TodayMetricsGrid({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeTokens = ref.watch(themeProvider.notifier).tokens;

    return GridView.count(
      crossAxisCount: 2,
      crossAxisSpacing: 12,
      mainAxisSpacing: 12,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      childAspectRatio: 1.25,
      children: [
        _buildMetricCard(
          tokens: themeTokens,
          title: 'Planned',
          icon: Icons.timer,
          value: '0h 0m',
          subtitle: 'Target workload',
        ),
        _buildRecordedCard(
          tokens: themeTokens,
          title: 'Recorded',
          percent: '0%',
          value: '0h 0m',
          progress: 0.0,
        ),
        _buildTasksDoneCard(
          tokens: themeTokens,
        ),
        _buildMetricCard(
          tokens: themeTokens,
          title: 'Spent',
          icon: Icons.payments,
          iconColor: Colors.orange,
          value: '₹0',
          subtitle: 'No expenses',
        ),
      ],
    );
  }

  Widget _buildMetricCard({
    required DayTraceThemeTokens tokens,
    required String title,
    required IconData icon,
    required String value,
    required String subtitle,
    Color? iconColor,
  }) {
    return _GlassCard(
      tokens: tokens,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                title.toUpperCase(),
                style: tokens.typography.labelSm.copyWith(
                  color: tokens.onSurfaceVariant,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 1.2,
                ),
              ),
              Icon(icon, size: 18, color: iconColor ?? tokens.onSurfaceVariant),
            ],
          ),
          const Spacer(),
          Text(
            value,
            style: tokens.typography.headlineLg.copyWith(
              color: tokens.onSurface,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            subtitle,
            style: tokens.typography.labelSm.copyWith(
              color: tokens.onSurfaceVariant,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTasksDoneCard({required DayTraceThemeTokens tokens}) {
    return _GlassCard(
      tokens: tokens,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'DONE',
                style: tokens.typography.labelSm.copyWith(
                  color: tokens.onSurfaceVariant,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 1.2,
                ),
              ),
              Icon(Icons.task_alt, size: 18, color: tokens.secondary),
            ],
          ),
          const Spacer(),
          Row(
            crossAxisAlignment: CrossAxisAlignment.baseline,
            textBaseline: TextBaseline.alphabetic,
            children: [
              Text(
                '0',
                style: tokens.typography.headlineLg.copyWith(
                  color: tokens.onSurface,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(width: 4),
              Text(
                '/ 0',
                style: tokens.typography.headlineMd.copyWith(
                  color: tokens.onSurfaceVariant.withValues(alpha: 0.5),
                  fontWeight: FontWeight.normal,
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            '0 pending milestones',
            style: tokens.typography.labelSm.copyWith(
              color: tokens.onSurfaceVariant,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRecordedCard({
    required DayTraceThemeTokens tokens,
    required String title,
    required String percent,
    required String value,
    required double progress,
  }) {
    return _GlassCard(
      tokens: tokens,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                title.toUpperCase(),
                style: tokens.typography.labelSm.copyWith(
                  color: tokens.onSurfaceVariant,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 1.2,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: tokens.secondary.withValues(alpha: 0.1),
                  border: Border.all(color: tokens.secondary.withValues(alpha: 0.3)),
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(
                      color: tokens.secondary.withValues(alpha: 0.12),
                      blurRadius: 8,
                    )
                  ],
                ),
                child: Text(
                  percent,
                  style: tokens.typography.labelSm.copyWith(
                    color: tokens.secondary,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          const Spacer(),
          Text(
            value,
            style: tokens.typography.headlineLg.copyWith(
              color: tokens.secondary,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Container(
            height: 6,
            width: double.infinity,
            decoration: BoxDecoration(
              color: tokens.onSurface.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(3),
            ),
            child: FractionallySizedBox(
              alignment: Alignment.centerLeft,
              widthFactor: progress,
              child: Container(
                decoration: BoxDecoration(
                  color: tokens.secondary,
                  borderRadius: BorderRadius.circular(3),
                  boxShadow: [
                    BoxShadow(
                      color: tokens.secondary.withValues(alpha: 0.6),
                      blurRadius: 6,
                    )
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _GlassCard extends StatelessWidget {
  final DayTraceThemeTokens tokens;
  final Widget child;

  const _GlassCard({required this.tokens, required this.child});

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(16),
      child: BackdropFilter(
        filter: ui.ImageFilter.blur(sigmaX: 10, sigmaY: 10),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: tokens.surface.withValues(alpha: 0.8),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: tokens.outlineVariant.withValues(alpha: 0.6)),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.04),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: child,
        ),
      ),
    );
  }
}
