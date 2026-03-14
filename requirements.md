# Inventory Tracking System Requirements

## Overview

This system is an inventory tracking application built around Laravel Eloquent models and relationships.

The system manages:

- item categories and items
- vendors that supply items
- departments and users with fixed roles
- request submission and approval workflow
- inventory-backed distribution workflow
- travel scheduling for approved distributions
- user acceptance with issue reporting

All inventory measurements are tracked in `unit` only.

## Core Models And Laravel Relationships

The system should be designed using Laravel model relationships as the primary domain structure.

### Inventory Domain

- `ItemCategory` hasMany `Item`
- `Item` belongsTo `ItemCategory`
- `Vendor` belongsToMany `Item`
- `Item` belongsToMany `Vendor`

Because the same item can be supplied by multiple vendors, the vendor-item relationship must support inventory-related data such as available unit quantity per vendor-item combination.

### Organization Domain

- `Department` hasMany `User`
- `User` belongsTo `Department`

Each user has exactly one role.

### Request And Fulfillment Domain

- `User` hasMany `Request`
- `Request` belongsTo `User`
- `Request` hasOne `Distribution`
- `Distribution` belongsTo `Request`
- `DistributionTravel` belongsTo `Distribution`
- `DistributionAcceptance` belongsTo `Request`
- `DistributionAcceptance` belongsTo `Distribution`

### Supporting Unit-Level Records

Although the main business entities are listed above, the workflow requires supporting child records to represent unit-level actions.

These supporting records should exist conceptually for:

- requested units within a request
- distributed units within a distribution
- accepted or reported units within an acceptance

These detail records are required because request, distribution, and acceptance behavior happens at unit level, not only at quantity summary level.

## Roles And Departments

The system supports the following user roles:

- `User`
- `Manager`
- `Admin`
- `GeneralManager`

Rules:

- each user has exactly one role
- there are many departments
- `HQ` is a normal department record
- `Admin` users belong to `HQ`
- `GeneralManager` users belong to `HQ`
- `User` and `Manager` belong to regular departments
- a `User` and the `Manager` who reviews that user's request must belong to the same department

## Inventory Requirements

- inventory is tracked only in `unit`
- vendors may supply many items
- the same item may be supplied by many vendors
- an item belongs to one item category
- the system may contain many vendors and many item categories
- inventory availability must be checked before distribution is created
- a distribution must not exceed available inventory

Example:

- a vendor may supply 10 units of computers
- the same vendor may also supply 35 units of printer toner
- the same vendor may also supply 100 units of mouse

## Request Workflow

### Request Creation

A `User` can create a `Request`.

A request may include multiple items from multiple item categories. For example:

- 10 computers
- 12 printers

However, the request must be tracked at unit level. This means if a user requests 10 computers, the system stores 10 separate requested units.

Each requested unit must store:

- requested `Item`
- `type` with allowed values `NEW` or `REPLACEMENT`
- `receiver_name`
- `location`

### Manager Review

After submission, the request is forwarded to the `Manager` from the same department as the requesting user.

The `Manager` can:

- approve the request
- reject the request

If the `Manager` rejects the request:

- the request is returned to the user
- a rejection reason must be provided
- the user must create a new request
- the same request is not revised and resubmitted

### Admin Review

If the `Manager` approves the request, it is sent to `Admin`.

`Admin` can view manager-approved requests from all departments.

The `Admin` can:

- approve the request
- reject the request

If the `Admin` rejects the request:

- the request is closed
- the user must create a new request
- the same request is not revised and resubmitted

## Distribution Workflow

### Distribution Creation

After `Admin` approves a request, `Admin` checks inventory and creates a `Distribution`.

Rules:

- `Distribution` belongsTo `Request`
- each request can have zero or one distribution
- only one distribution attempt is allowed per request
- a distribution may be partial

Example:

- a user requests 10 computers
- inventory allows only 8 computers
- `Admin` creates one distribution for 8 approved units using the original request as reference

Because distribution can be partial, distribution details must also be tracked at unit level.

### General Manager Review

The `Distribution` is sent to `GeneralManager`.

The `GeneralManager` can:

- approve the distribution
- reject the distribution

If the `GeneralManager` rejects the distribution:

- the process is closed permanently
- `Admin` cannot create another distribution for the same request
- the user must create a new request if a new process is needed

## Distribution Travel

Once `GeneralManager` approves the distribution and `Admin` receives that approval, `Admin` initiates `DistributionTravel`.

`DistributionTravel` must store:

- `travel_date`
- `expected_arrival_date`

The travel record represents shipment or movement of the approved distributed items toward the user's location.

## Distribution Acceptance

After the distribution travel is received, the `User` initiates `DistributionAcceptance`.

Relationship requirements:

- `DistributionAcceptance` belongsTo the original `Request`
- `DistributionAcceptance` belongsTo the approved `Distribution`

### Acceptance Rules

- acceptance may be partial
- the user can accept some distributed units and not accept others
- the user can report issues during acceptance
- after acceptance submission, the process is closed

Because acceptance is partial, acceptance should also be represented at unit level.

### Fixed Issue Types

Issue reporting in acceptance must use fixed issue types:

- `MISSING`
- `DAMAGED`
- `WRONG_ITEM`

## Enumerations

### Roles

- `User`
- `Manager`
- `Admin`
- `GeneralManager`

### Request Unit Types

- `NEW`
- `REPLACEMENT`

### Acceptance Issue Types

- `MISSING`
- `DAMAGED`
- `WRONG_ITEM`

## Business Rules And Constraints

- use Laravel Eloquent relationships as the main domain modeling approach
- each user has exactly one role
- `HQ` is a standard department record
- `Admin` and `GeneralManager` belong to `HQ`
- `User` requests are reviewed by the `Manager` from the same department
- inventory is measured only in `unit`
- the same item can be supplied by multiple vendors
- request details are tracked at unit level
- distribution details are tracked at unit level
- acceptance details are tracked at unit level
- one request can have at most one distribution attempt
- distribution cannot exceed available inventory
- manager rejection requires a new request
- admin rejection requires a new request
- general manager rejection closes the process permanently
- acceptance submission closes the process

## Example End-To-End Flow

1. A `User` creates a request for 10 computers and 12 printers.
2. Each requested unit stores its own `type`, `receiver_name`, and `location`.
3. The request is sent to the `Manager` from the same department.
4. The `Manager` approves the request.
5. The request is sent to `Admin`.
6. `Admin` checks available inventory.
7. `Admin` approves only 8 of the 10 requested computers and creates one `Distribution` linked to the request.
8. `GeneralManager` reviews and approves the distribution.
9. `Admin` creates `DistributionTravel` with a travel date and expected arrival date.
10. The `User` receives the delivery and creates `DistributionAcceptance`.
11. The user partially accepts the delivered units and reports any `MISSING`, `DAMAGED`, or `WRONG_ITEM` issues.
12. After acceptance is submitted, the process is closed.
