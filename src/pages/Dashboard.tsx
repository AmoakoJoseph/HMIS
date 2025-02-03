import React, { useEffect, useState } from 'react';
import { Calendar, Users, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';

interface DashboardStats {
  totalPatients: number;
  todayAppointments: number;
  upcomingAppointments: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    todayAppointments: 0,
    upcomingAppointments: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get total patients
      const { count: totalPatients } = await supabase
        .from('patients')
        .select('*', { count: 'exact' });

      // Get today's appointments
      const { count: todayAppointments } = await supabase
        .from('appointments')
        .select('*', { count: 'exact' })
        .gte('appointment_date', today.toISOString())
        .lt('appointment_date', new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString());

      // Get upcoming appointments
      const { count: upcomingAppointments } = await supabase
        .from('appointments')
        .select('*', { count: 'exact' })
        .gt('appointment_date', new Date().toISOString())
        .eq('status', 'scheduled');

      setStats({
        totalPatients: totalPatients || 0,
        todayAppointments: todayAppointments || 0,
        upcomingAppointments: upcomingAppointments || 0,
      });
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Patients"
          value={stats.totalPatients}
          icon={<Users className="h-6 w-6 text-blue-600" />}
        />
        <StatCard
          title="Today's Appointments"
          value={stats.todayAppointments}
          icon={<Calendar className="h-6 w-6 text-green-600" />}
        />
        <StatCard
          title="Upcoming Appointments"
          value={stats.upcomingAppointments}
          icon={<Clock className="h-6 w-6 text-purple-600" />}
        />
      </div>

      <RecentAppointments />
    </div>
  );
};

const StatCard = ({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
      </div>
      {icon}
    </div>
  </div>
);

const RecentAppointments = () => {
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    const fetchRecentAppointments = async () => {
      const { data } = await supabase
        .from('appointments')
        .select(`
          id,
          appointment_date,
          status,
          patients (full_name),
          users (full_name)
        `)
        .order('appointment_date', { ascending: false })
        .limit(5);

      if (data) setAppointments(data);
    };

    fetchRecentAppointments();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Recent Appointments</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">{appointment.patients.full_name}</p>
                <p className="text-sm text-gray-500">with Dr. {appointment.users.full_name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {format(new Date(appointment.appointment_date), 'MMM d, yyyy')}
                </p>
                <p className="text-sm text-gray-500">
                  {format(new Date(appointment.appointment_date), 'h:mm a')}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;