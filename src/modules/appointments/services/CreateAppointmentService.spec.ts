import AppError from '@shared/errors/AppError';

import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 10, 12, 12).getTime();
    });

    const appointment = await createAppointment.execute({
      date: new Date(2020, 10, 12, 13),
      user_id: '123123',
      provider_id: '123456',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123456');
  });

  it('should not able to create two appointments on the same time', async () => {
    const appointmentDate = new Date(2021, 1, 1, 11);

    await createAppointment.execute({
      date: appointmentDate,
      user_id: '123123',
      provider_id: '123456',
    });

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        user_id: '123123',
        provider_id: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appoitment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 10, 12, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 10, 12, 11),
        user_id: '123123',
        provider_id: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appoitment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 10, 12, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 10, 12, 13),
        user_id: '123123',
        provider_id: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appoitment before 8am and after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 10, 12, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 10, 12, 7),
        user_id: '123123',
        provider_id: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        date: new Date(2020, 10, 12, 18),
        user_id: '123123',
        provider_id: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
