<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),

            'student_id' => [
                'nullable',
                'string',
                'max:255',
                Rule::requiredIf(
                    fn () => ($input['role'] ?? null) === 'student'
                ),
            ],

            'year_level' => [
                'nullable',
                Rule::in([
                    '1st Year',
                    '2nd Year',
                    '3rd Year',
                    '4th Year',
                ]),
                Rule::requiredIf(
                    fn () => ($input['role'] ?? null) === 'student'
                ),
            ],

            'role' => [
                'required',
                'in:student,teacher',
            ],

            'password' => $this->passwordRules(),
        ])->validate();

        return User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'student_id' => $input['student_id'] ?? null,
            'year_level' => $input['year_level'] ?? null,
            'role' => $input['role'],
            'password' => $input['password'],
        ]);
    }
}