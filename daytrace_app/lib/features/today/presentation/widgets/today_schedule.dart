import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/theme_provider.dart';
import '../../../../core/theme/daytrace_theme.dart';

class TodaySchedule extends ConsumerWidget {
  const TodaySchedule({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeTokens = ref.watch(themeProvider.notifier).tokens;

    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                Text(
                  'Today\'s Schedule',
                  style: themeTokens.typography.headlineMd.copyWith(
                    color: themeTokens.onSurface,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(width: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 2),
                  decoration: BoxDecoration(
                    color: themeTokens.surfaceContainer,
                    border: Border.all(color: themeTokens.outlineVariant.withValues(alpha: 0.5)),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Text(
                    '8 Blocks',
                    style: themeTokens.typography.labelSm.copyWith(
                      color: themeTokens.onSurfaceVariant,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
            Row(
              children: [
                Text(
                  'Timeline View',
                  style: themeTokens.typography.labelMd.copyWith(
                    color: const Color(0xFF0DD1E0), // Teal accent
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const Icon(Icons.chevron_right, size: 16, color: Color(0xFF0DD1E0)),
              ],
            ),
          ],
        ),
        const SizedBox(height: 32),
        Center(
          child: Text(
            'No tasks scheduled yet.',
            style: themeTokens.typography.bodyMd.copyWith(
              color: themeTokens.onSurfaceVariant.withValues(alpha: 0.5),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildCompletedBlock({
    required DayTraceThemeTokens tokens,
    required String time,
    required String tag,
    required String title,
    required String duration,
  }) {
    return _GlassBlock(
      tokens: tokens,
      opacity: 0.85,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Row(
              children: [
                Container(
                  width: 28,
                  height: 28,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: tokens.secondary.withValues(alpha: 0.15),
                    border: Border.all(color: tokens.secondary.withValues(alpha: 0.3)),
                  ),
                  child: Icon(Icons.check, size: 18, color: tokens.secondary),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text(time, style: tokens.typography.labelSm.copyWith(color: tokens.onSurfaceVariant)),
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: tokens.surfaceContainer,
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(tag, style: tokens.typography.labelSm.copyWith(color: tokens.onSurfaceVariant)),
                          ),
                        ],
                      ),
                      const SizedBox(height: 2),
                      Text(
                        title,
                        style: tokens.typography.bodyMd.copyWith(
                          color: tokens.onSurfaceVariant,
                          decoration: TextDecoration.lineThrough,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          Text(duration, style: tokens.typography.labelSm.copyWith(color: tokens.onSurfaceVariant)),
        ],
      ),
    );
  }

  Widget _buildActiveBlock({
    required DayTraceThemeTokens tokens,
    required String time,
    required String tag,
    required String title,
    required String timeLeft,
    required String percent,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: tokens.surface.withValues(alpha: 0.95),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: tokens.secondary.withValues(alpha: 0.6)),
        boxShadow: [
          BoxShadow(
            color: tokens.secondary.withValues(alpha: 0.15),
            blurRadius: 16,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: Stack(
          children: [
            Positioned(
              left: 0,
              top: 0,
              bottom: 0,
              width: 4,
              child: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [tokens.secondary, const Color(0xFF00CBE8)],
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                  ),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Row(
                      children: [
                        Container(
                          width: 28,
                          height: 28,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: tokens.secondary.withValues(alpha: 0.2),
                            boxShadow: [
                              BoxShadow(
                                color: tokens.secondary.withValues(alpha: 0.3),
                                blurRadius: 8,
                              )
                            ],
                          ),
                          child: Icon(Icons.adjust, size: 18, color: tokens.secondary),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Text(
                                    time,
                                    style: tokens.typography.labelSm.copyWith(
                                      color: tokens.secondary,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                    decoration: BoxDecoration(
                                      color: tokens.secondary.withValues(alpha: 0.1),
                                      border: Border.all(color: tokens.secondary.withValues(alpha: 0.3)),
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: Text(
                                      tag,
                                      style: tokens.typography.labelSm.copyWith(
                                        color: tokens.secondary,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 4),
                              Text(
                                title,
                                style: tokens.typography.bodyMd.copyWith(
                                  color: tokens.onSurface,
                                  fontWeight: FontWeight.bold,
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(timeLeft, style: tokens.typography.labelSm.copyWith(color: tokens.secondary, fontWeight: FontWeight.bold)),
                      Text(percent, style: tokens.typography.labelSm.copyWith(color: tokens.onSurfaceVariant)),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildUpcomingBlock({
    required DayTraceThemeTokens tokens,
    required String time,
    required String tag,
    required String title,
    required IconData icon,
    required Color iconColor,
    required Color iconBgColor,
    required String duration,
  }) {
    return _GlassBlock(
      tokens: tokens,
      opacity: 0.8,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Row(
              children: [
                Container(
                  width: 28,
                  height: 28,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: iconBgColor,
                  ),
                  child: Icon(icon, size: 16, color: iconColor),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text(time, style: tokens.typography.labelSm.copyWith(color: tokens.onSurfaceVariant)),
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: tokens.surfaceContainer,
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(tag, style: tokens.typography.labelSm.copyWith(color: tokens.onSurfaceVariant)),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        title,
                        style: tokens.typography.bodyMd.copyWith(
                          color: tokens.onSurface,
                          fontWeight: FontWeight.w600,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          Text(duration, style: tokens.typography.labelSm.copyWith(color: tokens.onSurfaceVariant)),
        ],
      ),
    );
  }
}

class _GlassBlock extends StatelessWidget {
  final DayTraceThemeTokens tokens;
  final Widget child;
  final double opacity;

  const _GlassBlock({required this.tokens, required this.child, required this.opacity});

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(16),
      child: BackdropFilter(
        filter: ui.ImageFilter.blur(sigmaX: 10, sigmaY: 10),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: tokens.surface.withValues(alpha: opacity),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: tokens.outlineVariant.withValues(alpha: 0.5)),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.02),
                blurRadius: 4,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: child,
        ),
      ),
    );
  }
}
