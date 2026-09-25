import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/theme_provider.dart';
import '../../../core/theme/daytrace_theme.dart';

class MoneyScreen extends ConsumerWidget {
  const MoneyScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeTokens = ref.watch(themeProvider.notifier).tokens;

    return Scaffold(
      backgroundColor: Colors.transparent,
      body: CustomScrollView(
        slivers: [
          // Frosted Glass Header
          SliverAppBar(
            pinned: true,
            backgroundColor: themeTokens.background.withValues(alpha: 0.75),
            flexibleSpace: ClipRect(
              child: BackdropFilter(
                filter: ui.ImageFilter.blur(sigmaX: 20, sigmaY: 20),
                child: Container(
                  decoration: BoxDecoration(
                    border: Border(
                      bottom: BorderSide(
                        color: themeTokens.onSurface.withValues(alpha: 0.08),
                        width: 1,
                      ),
                    ),
                  ),
                ),
              ),
            ),
            title: Text(
              'Money',
              style: themeTokens.typography.headlineMd.copyWith(
                color: themeTokens.onSurface,
                fontWeight: FontWeight.bold,
              ),
            ),
            centerTitle: false,
            actions: [
              IconButton(
                icon: const Icon(Icons.add_card),
                color: themeTokens.onSurfaceVariant,
                onPressed: () {},
              ),
              const SizedBox(width: 8),
            ],
          ),
          
          // Main Content
          SliverPadding(
            padding: const EdgeInsets.only(
              left: 16.0,
              right: 16.0,
              top: 24.0,
              bottom: 100.0,
            ),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                _buildTotalSpentCard(themeTokens),
                const SizedBox(height: 24),
                _buildSectionHeader(themeTokens, 'Recent Transactions'),
                const SizedBox(height: 32),
                Center(
                  child: Text(
                    'No transactions yet.',
                    style: themeTokens.typography.bodyMd.copyWith(
                      color: themeTokens.onSurfaceVariant.withValues(alpha: 0.5),
                    ),
                  ),
                ),
              ]),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTotalSpentCard(DayTraceThemeTokens tokens) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(20),
      child: BackdropFilter(
        filter: ui.ImageFilter.blur(sigmaX: 10, sigmaY: 10),
        child: Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: tokens.primary.withValues(alpha: 0.15),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: tokens.primary.withValues(alpha: 0.3)),
          ),
          child: Column(
            children: [
              Text(
                'Total Spent Today',
                style: tokens.typography.labelMd.copyWith(
                  color: tokens.onSurfaceVariant,
                  letterSpacing: 1.2,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                '₹0',
                style: tokens.typography.displayLgMobile.copyWith(
                  color: tokens.onSurface,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSectionHeader(DayTraceThemeTokens tokens, String title) {
    return Padding(
      padding: const EdgeInsets.only(left: 4.0),
      child: Text(
        title.toUpperCase(),
        style: tokens.typography.labelSm.copyWith(
          color: tokens.onSurfaceVariant,
          fontWeight: FontWeight.w700,
          letterSpacing: 1.2,
        ),
      ),
    );
  }

  Widget _buildTransactionCard({
    required DayTraceThemeTokens tokens,
    required String title,
    required String category,
    required String amount,
    required String time,
    required IconData icon,
    required Color color,
  }) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(16),
      child: BackdropFilter(
        filter: ui.ImageFilter.blur(sigmaX: 10, sigmaY: 10),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: tokens.surface.withValues(alpha: 0.8),
            border: Border.all(color: tokens.outlineVariant.withValues(alpha: 0.6)),
            borderRadius: BorderRadius.circular(16),
          ),
          child: Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(icon, color: color),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: tokens.typography.bodyLg.copyWith(
                        color: tokens.onSurface,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      category,
                      style: tokens.typography.bodySm.copyWith(
                        color: tokens.onSurfaceVariant,
                      ),
                    ),
                  ],
                ),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    amount,
                    style: tokens.typography.bodyLg.copyWith(
                      color: tokens.onSurface,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    time,
                    style: tokens.typography.bodySm.copyWith(
                      color: tokens.onSurfaceVariant,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
