import React, { useState, useEffect, useCallback } from 'react';
import { Platform, View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, RefreshControl, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  X,
  User,
  FileText,
  CreditCard
} from 'lucide-react-native';
import { theme } from '../../constants/theme';
import ApiService from '../../services/apiService';
import Header from '../../components/common/Header';

interface PaymentHistoryItem {
  appointment_id: string;
  appointment_form_name: string;
  appointment_date: string;
  appointment_time: string;
  appointment_status: string;
  total_price: string;
  payment_status: string;
  payment_required: boolean;
  is_paid: boolean;
  paid_at: string | null;
  payment_session_id: string | null;
  payment_intent_id: string | null;
  created_at: string;
  updated_at: string;
}

interface PaymentHistoryData {
  payment_history: PaymentHistoryItem[];
  summary: {
    total_appointments: number;
    paid_appointments: number;
    pending_payments: number;
    total_amount_paid: number;
    total_amount_pending: number;
    free_appointments: number;
  };
}

interface PaymentHistoryScreenProps {
  navigation: any;
}

const PaymentHistoryScreen: React.FC<PaymentHistoryScreenProps> = ({ navigation }) => {
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentHistoryItem | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await ApiService.getPaymentHistory();
      
      if (response.success && response.data) {
        setPaymentHistory(response.data);
      }
    } catch (error) {
      console.error('Error fetching payment history:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async (): Promise<void> => {
    setRefreshing(true);
    await fetchPaymentHistory();
    setRefreshing(false);
  }, []);

  const formatPaymentDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatPaymentTime = (timeString: string): string => {
    if (!timeString) return '';
    
    try {
      let timeToFormat = timeString;
      if (timeString.includes('T')) {
        timeToFormat = timeString.split('T')[1]?.substring(0, 5) || timeString;
      }
      
      const [hours, minutes] = timeToFormat.split(':');
      if (!hours || !minutes) return timeString;
      
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return timeString;
    }
  };

  const formatFullDateTime = (dateString: string, timeString: string): string => {
    try {
      const date = new Date(dateString);
      let timeToFormat = timeString;
      if (timeString.includes('T')) {
        timeToFormat = timeString.split('T')[1]?.substring(0, 5) || timeString;
      }
      
      const [hours, minutes] = timeToFormat.split(':');
      if (hours && minutes) {
        date.setHours(parseInt(hours), parseInt(minutes));
      }
      
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return `${dateString} ${timeString}`;
    }
  };

  const getPaymentStatusIcon = (paymentStatus: string, isPaid: boolean) => {
    if (isPaid) return CheckCircle;
    if (paymentStatus === 'pending') return AlertCircle;
    return XCircle;
  };

  const getPaymentStatusColor = (paymentStatus: string, isPaid: boolean) => {
    if (isPaid) return theme.colors.success;
    if (paymentStatus === 'pending') return theme.colors.primary;
    return theme.colors.error;
  };

  const openPaymentDetail = (payment: PaymentHistoryItem) => {
    setSelectedPayment(payment);
    setModalVisible(true);
  };

  const closePaymentDetail = () => {
    setModalVisible(false);
    setSelectedPayment(null);
  };


  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Payment History" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading payment history...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Payment History" />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.content}>
          {/* Summary Cards */}
          {paymentHistory?.summary && (
            <View style={styles.summaryContainer}>
              <View style={styles.summaryCard}>
                <View style={styles.summaryIconContainer}>
                  <DollarSign size={16} color={theme.colors.success} />
                </View>
                <View style={styles.summaryContent}>
                  <Text style={styles.summaryValue}>
                    ${paymentHistory.summary.total_amount_paid}
                  </Text>
                  <Text style={styles.summaryLabel}>Total Paid</Text>
                </View>
              </View>
              
              <View style={styles.summaryCard}>
                <View style={styles.summaryIconContainer}>
                  <AlertCircle size={16} color={theme.colors.primary} />
                </View>
                <View style={styles.summaryContent}>
                  <Text style={styles.summaryValue}>
                    ${paymentHistory.summary.total_amount_pending}
                  </Text>
                  <Text style={styles.summaryLabel}>Pending</Text>
                </View>
              </View>
            </View>
          )}

          {/* Payment History List */}
          {paymentHistory?.payment_history && paymentHistory.payment_history.length > 0 ? (
            <View style={styles.paymentHistoryContainer}>
              <Text style={styles.sectionTitle}>Payment Records</Text>
              <View style={styles.paymentHistoryCard}>
                {paymentHistory.payment_history.map((payment, index) => {
                  const StatusIcon = getPaymentStatusIcon(payment.payment_status, payment.is_paid);
                  const statusColor = getPaymentStatusColor(payment.payment_status, payment.is_paid);
                  
                  return (
                    <TouchableOpacity
                      key={payment.appointment_id}
                      style={[
                        styles.paymentHistoryItem,
                        index < paymentHistory.payment_history.length - 1 && styles.paymentHistoryItemBorder
                      ]}
                      activeOpacity={0.8}
                      onPress={() => openPaymentDetail(payment)}
                    >
                      <View style={styles.paymentHistoryHeader}>
                        <View style={styles.paymentHistoryInfo}>
                          <Text style={styles.paymentHistoryTitle}>
                            {payment.appointment_form_name}
                          </Text>
                          <View style={styles.paymentHistoryDetails}>
                            <Calendar size={14} color={theme.colors.text.tertiary} />
                            <Text style={styles.paymentHistoryDetailText}>
                              {formatPaymentDate(payment.appointment_date)}
                            </Text>
                            <View style={styles.paymentDetailSeparator} />
                            <Clock size={14} color={theme.colors.text.tertiary} />
                            <Text style={styles.paymentHistoryDetailText}>
                              {formatPaymentTime(payment.appointment_time)}
                            </Text>
                          </View>
                        </View>
                        
                        <View style={styles.paymentHistoryRight}>
                          <Text style={styles.paymentAmount}>
                            ${parseFloat(payment.total_price).toFixed(2)}
                          </Text>
                          <View style={styles.paymentStatusContainer}>
                            <StatusIcon size={14} color={statusColor} />
                            <Text style={[styles.paymentStatusText, { color: statusColor }]}>
                              {payment.is_paid ? 'Paid' : payment.payment_status}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <DollarSign size={32} color={theme.colors.text.light} />
              <Text style={styles.emptyTitle}>No payment history</Text>
              <Text style={styles.emptySubtitle}>
                Your payment records will appear here once you make payments
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Payment Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closePaymentDetail}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, Platform.OS === 'web' && styles.modalContentWeb]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Payment Details</Text>
              <TouchableOpacity onPress={closePaymentDetail} style={styles.closeButton}>
                <X size={24} color={theme.colors.text.secondary} />
              </TouchableOpacity>
            </View>
            
            {selectedPayment && (
              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                {/* Payment Status */}
                <View style={styles.modalSection}>
                  <View style={styles.modalSectionHeader}>
                    <Text style={styles.modalSectionTitle}>Payment Status</Text>
                    <View style={styles.paymentStatusContainer}>
                      {(() => {
                        const StatusIcon = getPaymentStatusIcon(selectedPayment.payment_status, selectedPayment.is_paid);
                        const statusColor = getPaymentStatusColor(selectedPayment.payment_status, selectedPayment.is_paid);
                        return (
                          <>
                            <StatusIcon size={16} color={statusColor} />
                            <Text style={[styles.modalStatusText, { color: statusColor }]}>
                              {selectedPayment.is_paid ? 'Paid' : selectedPayment.payment_status}
                            </Text>
                          </>
                        );
                      })()}
                    </View>
                  </View>
                </View>

                {/* Appointment Details */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Appointment Details</Text>
                  <View style={styles.modalDetailItem}>
                    <View style={styles.modalDetailIcon}>
                      <FileText size={16} color={theme.colors.primary} />
                    </View>
                    <View>
                      <Text style={styles.modalDetailLabel}>Service</Text>
                      <Text style={styles.modalDetailValue}>{selectedPayment.appointment_form_name}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.modalDetailItem}>
                    <View style={styles.modalDetailIcon}>
                      <Calendar size={16} color={theme.colors.primary} />
                    </View>
                    <View style={styles.modalDetailContent}>
                      <Text style={styles.modalDetailLabel}>Date & Time</Text>
                      <Text style={styles.modalDetailValue}>
                        {formatFullDateTime(selectedPayment.appointment_date, selectedPayment.appointment_time)}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Payment Information */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Payment Information</Text>
                  <View style={styles.modalDetailItem}>
                    <View style={styles.modalDetailIcon}>
                      <DollarSign size={16} color={theme.colors.primary} />
                    </View>
                    <View>
                      <Text style={styles.modalDetailLabel}>Amount</Text>
                      <Text style={styles.modalDetailValue}>
                        ${parseFloat(selectedPayment.total_price).toFixed(2)}
                      </Text>
                    </View>
                  </View>

                  {selectedPayment.paid_at && (
                    <View style={styles.modalDetailItem}>
                      <View style={styles.modalDetailIcon}>
                        <CheckCircle size={16} color={theme.colors.success} />
                      </View>
                      <View>
                        <Text style={styles.modalDetailLabel}>Paid At</Text>
                        <Text style={styles.modalDetailValue}>
                          {new Date(selectedPayment.paid_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </Text>
                      </View>
                    </View>
                  )}

                  {selectedPayment.payment_session_id && (
                    <View style={styles.modalDetailItem}>
                      <View style={styles.modalDetailIcon}>
                        <CreditCard size={16} color={theme.colors.primary} />
                      </View>
                      <View style={styles.modalDetailContent}>
                        <Text style={styles.modalDetailLabel}>Payment Session</Text>
                        <Text style={styles.modalDetailValue}>
                          {selectedPayment.payment_session_id}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>

                {/* System Information */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>System Information</Text>
                  <View style={styles.modalDetailItem}>
                    <View style={styles.modalDetailIcon}>
                      <FileText size={16} color={theme.colors.primary} />
                    </View>
                    <View>
                      <Text style={styles.modalDetailLabel}>Appointment ID</Text>
                      <Text style={styles.modalDetailValue}>
                        {selectedPayment.appointment_id.substring(0, 8)}...
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.modalDetailItem}>
                    <View style={styles.modalDetailIcon}>
                      <Calendar size={16} color={theme.colors.primary} />
                    </View>
                    <View>
                      <Text style={styles.modalDetailLabel}>Created</Text>
                      <Text style={styles.modalDetailValue}>
                        {new Date(selectedPayment.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit'
                        })}
                      </Text>
                    </View>
                  </View>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  loadingText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.md,
  },
  summaryContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.elegant,
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primaryGhost,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  summaryContent: {
    flex: 1,
  },
  summaryValue: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    letterSpacing: -0.1,
    lineHeight: 18,
  },
  summaryLabel: {
    fontSize: 10,
    color: theme.colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  paymentHistoryContainer: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    letterSpacing: -0.2,
  },
  paymentHistoryCard: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.elegant,
  },
  paymentHistoryItem: {
    padding: theme.spacing.md,
  },
  paymentHistoryItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
  },
  paymentHistoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  paymentHistoryInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  paymentHistoryTitle: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    letterSpacing: -0.1,
    marginBottom: theme.spacing.xs,
    lineHeight: 16,
  },
  paymentHistoryDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  paymentHistoryDetailText: {
    fontSize: 11,
    color: theme.colors.text.tertiary,
  },
  paymentDetailSeparator: {
    width: 2,
    height: 2,
    backgroundColor: theme.colors.text.light,
    borderRadius: 1,
    marginHorizontal: 4,
  },
  paymentHistoryRight: {
    alignItems: 'flex-end',
  },
  paymentAmount: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    letterSpacing: -0.1,
    marginBottom: theme.spacing.xs,
  },
  paymentStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  paymentStatusText: {
    fontSize: 10,
    fontWeight: theme.typography.weights.medium,
    textTransform: 'capitalize',
    letterSpacing: 0,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyTitle: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.muted,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  emptySubtitle: {
    fontSize: 11,
    color: theme.colors.text.light,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 16,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    ...(Platform.OS === 'web' && {
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.lg,
    }),
  },
  modalContent: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    maxHeight: '90%',
    minHeight: '60%',
  },
  modalContentWeb: {
    width: '100%',
    maxWidth: 500,
    maxHeight: '85%',
    borderRadius: theme.borderRadius.xl,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    margin: 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
  },
  modalTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    letterSpacing: -0.2,
  },
  closeButton: {
    padding: theme.spacing.sm,
  },
  modalBody: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  modalSection: {
    marginBottom: theme.spacing.md,
  },
  modalSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  modalSectionTitle: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    letterSpacing: -0.1,
  },
  modalStatusText: {
    fontSize: 11,
    fontWeight: theme.typography.weights.medium,
    textTransform: 'capitalize',
    letterSpacing: 0,
  },
  modalDetailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: theme.spacing.sm,
  },
  modalDetailIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primaryGhost,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
    marginTop: 2,
    flexShrink: 0,
  },
  modalDetailContent: {
    flex: 1,
    flexShrink: 1,
  },
  modalDetailLabel: {
    fontSize: 11,
    color: theme.colors.text.tertiary,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    fontWeight: theme.typography.weights.medium,
  },
  modalDetailValue: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weights.regular,
    lineHeight: 18,
    flexWrap: 'wrap',
  },
});

export default PaymentHistoryScreen;