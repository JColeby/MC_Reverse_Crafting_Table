--
-- PostgreSQL database dump
--

\restrict UKWAU3TQAzVK2Hpmpq07rDWePkoC9Zk5F0OHli98N0VeBDu4vDN6SxxNm9JcIbI

-- Dumped from database version 18.2
-- Dumped by pg_dump version 18.2

-- Started on 2026-02-28 19:41:34

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;

ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 5032 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';

SET default_tablespace = '';
SET default_table_access_method = heap;

--
-- TOC entry 223 (class 1259 OID 16471)
-- Name: ingredient; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ingredient (
    itemquantity integer NOT NULL,
    patternkey character(1),
    itemid integer NOT NULL,
    recipeid integer NOT NULL,
    CONSTRAINT ingredient_itemquantity_check CHECK (((itemquantity >= 1) AND (itemquantity <= 9)))
);


ALTER TABLE public.ingredient OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16444)
-- Name: item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.item (
    itemid integer NOT NULL,
    itemname character varying(64) NOT NULL
);


ALTER TABLE public.item OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16443)
-- Name: item_itemid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.item_itemid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.item_itemid_seq OWNER TO postgres;

--
-- TOC entry 5033 (class 0 OID 0)
-- Dependencies: 219
-- Name: item_itemid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.item_itemid_seq OWNED BY public.item.itemid;

--
-- TOC entry 222 (class 1259 OID 16455)
-- Name: recipe; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recipe (
    recipeid integer NOT NULL,
    recipetype character varying(20) NOT NULL,
    resultquantity integer NOT NULL,
    pattern character(9),
    itemid integer NOT NULL,
    CONSTRAINT recipe_recipetype_check CHECK (((recipetype)::text = ANY ((ARRAY['crafting_shaped'::character varying, 'crafting_shapeless'::character varying, 'stonecutting'::character varying, 'smelting'::character varying])::text[])))
);


ALTER TABLE public.recipe OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16454)
-- Name: recipe_recipeid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.recipe_recipeid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.recipe_recipeid_seq OWNER TO postgres;

--
-- TOC entry 5034 (class 0 OID 0)
-- Dependencies: 221
-- Name: recipe_recipeid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.recipe_recipeid_seq OWNED BY public.recipe.recipeid;

--
-- TOC entry 4865 (class 2604 OID 16447)
-- Name: item itemid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item ALTER COLUMN itemid SET DEFAULT nextval('public.item_itemid_seq'::regclass);

--
-- TOC entry 4866 (class 2604 OID 16458)
-- Name: recipe recipeid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipe ALTER COLUMN recipeid SET DEFAULT nextval('public.recipe_recipeid_seq'::regclass);

--
-- TOC entry 4876 (class 2606 OID 16479)
-- Name: ingredient ingredient_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredient
    ADD CONSTRAINT ingredient_pkey PRIMARY KEY (itemid, recipeid);

--
-- TOC entry 4870 (class 2606 OID 16453)
-- Name: item item_itemname_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT item_itemname_key UNIQUE (itemname);

--
-- TOC entry 4872 (class 2606 OID 16451)
-- Name: item item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT item_pkey PRIMARY KEY (itemid);

--
-- TOC entry 4874 (class 2606 OID 16465)
-- Name: recipe recipe_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipe
    ADD CONSTRAINT recipe_pkey PRIMARY KEY (recipeid);

--
-- TOC entry 4878 (class 2606 OID 16480)
-- Name: ingredient ingredient_itemid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredient
    ADD CONSTRAINT ingredient_itemid_fkey FOREIGN KEY (itemid) REFERENCES public.item(itemid);

--
-- TOC entry 4879 (class 2606 OID 16485)
-- Name: ingredient ingredient_recipeid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredient
    ADD CONSTRAINT ingredient_recipeid_fkey FOREIGN KEY (recipeid) REFERENCES public.recipe(recipeid);

--
-- TOC entry 4877 (class 2606 OID 16466)
-- Name: recipe recipe_itemid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipe
    ADD CONSTRAINT recipe_itemid_fkey FOREIGN KEY (itemid) REFERENCES public.item(itemid);

-- Completed on 2026-02-28 19:41:34

--
-- PostgreSQL database dump complete
--

\unrestrict UKWAU3TQAzVK2Hpmpq07rDWePkoC9Zk5F0OHli98N0VeBDu4vDN6SxxNm9JcIbI

