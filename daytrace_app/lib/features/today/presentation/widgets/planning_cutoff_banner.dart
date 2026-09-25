import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/theme_provider.dart';

class PlanningCutoffBanner extends ConsumerWidget {
  const PlanningCutoffBanner({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeTokens = ref.watch(themeProvider.notifier).tokens;

    return ClipRRect(
      borderRadius: BorderRadius.circular(16),
      child: BackdropFilter(
        filter: ui.ImageFilter.blur(sigmaX: 10, sigmaY: 10),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: themeTokens.surface.withValues(alpha: 0.8),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: themeTokens.outlineVariant.withValues(alpha: 0.6)),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.04),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Row(
                  children: [
                    Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [
                            Color(0xFF6161F5), // Indigo
                            Color(0xFF0DD1E0), // Teal
                          ],
                          begin: Alignment.bottomLeft,
                          end: Alignment.topRight,
                        ),
                        borderRadius: BorderRadius.circular(12),
                        boxShadow: [
                          BoxShadow(
                            color: const Color(0xFF0DD1E0).withValues(alpha: 0.3),
                            blurRadius: 6,
                          )
                        ],
                      ),
                      child: const Icon(Icons.event, color: Colors.white, size: 22),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Tomorrow\'s Planning Cutoff',
                            style: themeTokens.typography.labelLg.copyWith(
                              color: themeTokens.onSurface,
                              fontWeight: FontWeight.bold,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          Text(
                            'Closes tonight at 11:30 PM',
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
              const SizedBox(width: 8),
              InkWell(
                onTap: () {},
                borderRadius: BorderRadius.circular(12),
                child: Ink(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  decoration: BoxDecoration(
                    color: themeTokens.surfaceContainerHighest,
                    border: Border.all(color: themeTokens.outlineVariant.withValues(alpha: 0.6)),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    'Review',
                    style: themeTokens.typography.labelMd.copyWith(
                      color: themeTokens.primary,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
